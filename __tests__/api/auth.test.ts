
import { POST } from '@/app/api/auth/route';
import { POST as POST_LOGOUT } from '@/app/api/auth/logout/route';
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { auditLog } from '@/lib/server/audit';
import * as bcrypt from 'bcrypt';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/server/supabase');
jest.mock('@/lib/server/audit');
jest.mock('bcrypt');

const mockCreateSupabaseServerClient = createSupabaseServerClient as jest.Mock;
const mockAuditLog = auditLog as jest.Mock;
const mockBcryptCompare = bcrypt.compare as jest.Mock;

describe('/api/auth POST', () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockSupabaseClient = {
      auth: {
        signInWithPassword: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    mockCreateSupabaseServerClient.mockResolvedValue(mockSupabaseClient);
    mockAuditLog.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle step 1: successful credential validation', async () => {
    const requestBody = { email: 'test@example.com', password: 'password123' };
    const request = new NextRequest('http://localhost/api/auth', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '123', email: 'test@example.com' }, session: {} },
      error: null,
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.message).toBe('Credentials verified');
    expect(responseBody.step).toBe('master-password-required');
    expect(response.cookies.get('temp-auth-session')).toBeDefined();
  });

  it('should handle step 1: failed credential validation', async () => {
    const requestBody = { email: 'test@example.com', password: 'wrongpassword' };
    const request = new NextRequest('http://localhost/api/auth', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    });

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody.error).toBe('Invalid email or password');
    expect(mockAuditLog).toHaveBeenCalledWith(null, 'login_failed', 'user', null, expect.any(Object), expect.any(Object));
  });

  it('should handle step 2: successful master password validation', async () => {
    const requestBody = { email: 'test@example.com', password: 'password123', masterPassword: 'masterpass' };
    const request = new NextRequest('http://localhost/api/auth', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '123', email: 'test@example.com' }, session: { access_token: 'acc', refresh_token: 'ref', expires_in: 3600 } },
      error: null,
    });

    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { master_password_hash: 'hashed_master_password', full_name: 'Test User' },
      error: null,
    });

    mockBcryptCompare.mockResolvedValueOnce(true);

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.message).toBe('Login successful');
    expect(response.cookies.get('user-session')).toBeDefined();
    expect(response.cookies.get('auth-token')).toBeDefined();
    expect(mockAuditLog).toHaveBeenCalledWith('123', 'user_login_success', 'user', '123', expect.any(Object), expect.any(Object));
  });

  it('should handle step 2: failed master password validation', async () => {
    const requestBody = { email: 'test@example.com', password: 'password123', masterPassword: 'wrongmasterpass' };
    const request = new NextRequest('http://localhost/api/auth', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: '123', email: 'test@example.com' }, session: {} },
      error: null,
    });

    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { master_password_hash: 'hashed_master_password', full_name: 'Test User' },
      error: null,
    });

    mockBcryptCompare.mockResolvedValueOnce(false);

    const response = await POST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody.error).toBe('Invalid master password');
    expect(mockAuditLog).toHaveBeenCalledWith('123', 'master_password_failed', 'user', '123', expect.any(Object), expect.any(Object));
  });
});

describe('/api/auth/logout POST', () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockSupabaseClient = {
      auth: {
        signOut: jest.fn(),
      },
    };
    mockCreateSupabaseServerClient.mockResolvedValue(mockSupabaseClient);
  });

  it('should clear all auth cookies on logout', async () => {
    mockSupabaseClient.auth.signOut.mockResolvedValueOnce({ error: null });
    const response = await POST_LOGOUT();
    const cookies = response.headers.get('set-cookie') || '';

    expect(response.status).toBe(200);
    expect(cookies).toContain('auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    expect(cookies).toContain('user-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });
});
