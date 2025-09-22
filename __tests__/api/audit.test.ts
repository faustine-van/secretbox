
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { GET } from '@/app/api/audit/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/server/supabase');

const mockCreateSupabaseServerClient = createSupabaseServerClient as jest.Mock;

describe('/api/audit', () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockSupabaseClient = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      order: jest.fn(),
    };
    mockCreateSupabaseServerClient.mockResolvedValue(mockSupabaseClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
    const request = new NextRequest('http://localhost/api/audit');
    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('should return audit logs for an authenticated user', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: '123' } } });
    mockSupabaseClient.order.mockResolvedValueOnce({ data: [{ id: '1', action: 'login' }], count: 1, error: null });
    const request = new NextRequest('http://localhost/api/audit');
    const response = await GET(request);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.audit_logs).toHaveLength(1);
    expect(body.count).toBe(1);
  });

  it('should filter audit logs by date and action', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: '123' } } });
    mockSupabaseClient.order.mockResolvedValueOnce({ data: [{ id: '1', action: 'login' }], count: 1, error: null });
    const request = new NextRequest('http://localhost/api/audit?startDate=2023-01-01&endDate=2023-01-31&action=login');
    await GET(request);
    expect(mockSupabaseClient.gte).toHaveBeenCalledWith('created_at', '2023-01-01');
    expect(mockSupabaseClient.lte).toHaveBeenCalledWith('created_at', '2023-01-31');
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('action', 'login');
  });
});
