
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { audit } from '@/lib/server/audit';
import { encrypt } from '@/lib/server/encryption';
import { GET, POST } from '@/app/api/keys/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/server/supabase');
jest.mock('@/lib/server/audit');
jest.mock('@/lib/server/encryption');

const mockCreateSupabaseServerClient = createSupabaseServerClient as jest.Mock;
const mockAudit = audit as jest.Mock;
const mockEncrypt = encrypt as jest.Mock;

describe('/api/keys', () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockSupabaseClient = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    mockCreateSupabaseServerClient.mockResolvedValue(mockSupabaseClient);
    mockAudit.mockResolvedValue(undefined);
    mockEncrypt.mockResolvedValue({
      encryptedValue: 'encrypted',
      iv: 'iv',
      authTag: 'authTag',
      salt: 'salt',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
      const request = new NextRequest('http://localhost/api/keys');
      const response = await GET(request);
      expect(response.status).toBe(401);
    });

    it('should return keys for an authenticated user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: '123' } } });
      mockSupabaseClient.range.mockResolvedValueOnce({ data: [{ id: '1', name: 'Test Key' }], count: 1, error: null });
      const request = new NextRequest('http://localhost/api/keys');
      const response = await GET(request);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.keys).toHaveLength(1);
      expect(body.count).toBe(1);
    });
  });

  describe('POST', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
      const request = new NextRequest('http://localhost/api/keys', { method: 'POST', body: JSON.stringify({}) });
      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it('should create a key for an authenticated user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: '123' } } });
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id: '1', name: 'Test Key' }, error: null });
      const request = new NextRequest('http://localhost/api/keys', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Key', value: 'secret', key_type: 'api_key' }),
      });
      const response = await POST(request);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.name).toBe('Test Key');
    });

    it('should return 400 for invalid data', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: '123' } } });
      const request = new NextRequest('http://localhost/api/keys', {
        method: 'POST',
        body: JSON.stringify({ value: 'secret' }), // Missing name
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
