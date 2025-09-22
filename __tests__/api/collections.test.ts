
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { audit } from '@/lib/server/audit';
import { GET, POST } from '@/app/api/collections/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/server/supabase');
jest.mock('@/lib/server/audit');

const mockCreateSupabaseServerClient = createSupabaseServerClient as jest.Mock;
const mockAudit = audit as jest.Mock;

describe('/api/collections', () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    const from = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ data: [{ id: '1', name: 'Test Collection' }], error: null }),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: { id: '1', name: 'Test Collection' }, error: null }),
        })),
      })),
    }));
    mockSupabaseClient = {
      auth: {
        getUser: jest.fn(),
      },
      from,
    };
    mockCreateSupabaseServerClient.mockResolvedValue(mockSupabaseClient);
    mockAudit.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
      const request = new NextRequest('http://localhost/api/collections');
      const response = await GET(request);
      expect(response.status).toBe(401);
    });

    it('should return collections for an authenticated user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: '123' } } });
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [{ id: '1', name: 'Test Collection' }], error: null }),
      });
      const request = new NextRequest('http://localhost/api/collections');
      const response = await GET(request);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body).toHaveLength(1);
    });
  });

  describe('POST', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
      const request = new NextRequest('http://localhost/api/collections', { method: 'POST', body: JSON.stringify({}) });
      const response = await POST(request);
      expect(response.status).toBe(401);
    });

    it('should create a collection for an authenticated user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: '123' } } });
      mockSupabaseClient.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: '1', name: 'Test Collection' }, error: null }),
      });
      const request = new NextRequest('http://localhost/api/collections', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Collection' }),
      });
      const response = await POST(request);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.name).toBe('Test Collection');
    });

    it('should return 400 for invalid data', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: '123' } } });
      const request = new NextRequest('http://localhost/api/collections', {
        method: 'POST',
        body: JSON.stringify({}), // Missing name
      });
      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
