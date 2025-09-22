import { validateMasterPassword } from '@/lib/server/auth';
import { createSupabaseServerClient } from '@/lib/server/supabase';
import * as bcrypt from 'bcrypt';

jest.mock('@/lib/server/supabase');
jest.mock('bcrypt');

const mockCreateSupabaseServerClient = createSupabaseServerClient as jest.Mock;
const mockBcryptCompare = bcrypt.compare as jest.Mock;

describe('validateMasterPassword', () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    mockCreateSupabaseServerClient.mockResolvedValue(mockSupabaseClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for a valid master password', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { master_password_hash: 'hashed_password' },
      error: null,
    });
    mockBcryptCompare.mockResolvedValueOnce(true);

    const isValid = await validateMasterPassword('123', 'password123');
    expect(isValid).toBe(true);
  });

  it('should return false for an invalid master password', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({
      data: { master_password_hash: 'hashed_password' },
      error: null,
    });
    mockBcryptCompare.mockResolvedValueOnce(false);

    const isValid = await validateMasterPassword('123', 'wrong_password');
    expect(isValid).toBe(false);
  });

  it('should return false if the user profile is not found', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: null });

    const isValid = await validateMasterPassword('123', 'password123');
    expect(isValid).toBe(false);
  });

  it('should return false if there is a database error', async () => {
    mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: new Error('DB Error') });

    const isValid = await validateMasterPassword('123', 'password123');
    expect(isValid).toBe(false);
  });
});