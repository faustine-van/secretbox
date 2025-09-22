
import { encrypt, decrypt } from '@/lib/server/encryption';
import { audit } from '@/lib/server/audit';

jest.mock('@/lib/server/audit', () => ({
  audit: jest.fn(),
}));

describe('Encryption', () => {
  const plaintext = 'This is a secret message';
  const secretKey = 'a-very-secret-key';

  it('should encrypt and decrypt a string successfully', async () => {
    const { encryptedValue, iv, authTag, salt } = await encrypt(plaintext, secretKey);

    expect(encryptedValue).toBeDefined();
    expect(iv).toBeDefined();
    expect(authTag).toBeDefined();
    expect(salt).toBeDefined();

    const decrypted = await decrypt(encryptedValue, iv, authTag, salt, secretKey);
    expect(decrypted).toBe(plaintext);
  });

  it('should fail decryption if the authTag is incorrect', async () => {
    const { encryptedValue, iv, authTag, salt } = await encrypt(plaintext, secretKey);
    const tamperedAuthTag = authTag.replace(/./g, '0');

    await expect(decrypt(encryptedValue, iv, tamperedAuthTag, salt, secretKey)).rejects.toThrow('Decryption failed: Unsupported state or unable to authenticate data');
  });

  it('should fail decryption if the iv is incorrect', async () => {
    const { encryptedValue, iv, authTag, salt } = await encrypt(plaintext, secretKey);
    const tamperedIv = iv.replace(/./g, '0');

    await expect(decrypt(encryptedValue, tamperedIv, authTag, salt, secretKey)).rejects.toThrow('Decryption failed: Unsupported state or unable to authenticate data');
  });

  it('should call the audit function on success', async () => {
    await encrypt(plaintext, secretKey);
    expect(audit).toHaveBeenCalledWith(expect.objectContaining({ action: 'encrypt', success: true }));

    const { encryptedValue, iv, authTag, salt } = await encrypt(plaintext, secretKey);
    await decrypt(encryptedValue, iv, authTag, salt, secretKey);
    expect(audit).toHaveBeenCalledWith(expect.objectContaining({ action: 'decrypt', success: true }));
  });

  it('should produce a different encrypted value each time for the same plaintext', async () => {
    const encryption1 = await encrypt(plaintext, secretKey);
    const encryption2 = await encrypt(plaintext, secretKey);

    expect(encryption1.encryptedValue).not.toBe(encryption2.encryptedValue);
    expect(encryption1.iv).not.toBe(encryption2.iv);
    expect(encryption1.salt).not.toBe(encryption2.salt);
  });

  it('should perform encryption and decryption within an acceptable time frame', async () => {
    const startTime = Date.now();
    const { encryptedValue, iv, authTag, salt } = await encrypt(plaintext, secretKey);
    await decrypt(encryptedValue, iv, authTag, salt, secretKey);
    const endTime = Date.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(500); // Set a reasonable threshold, e.g., 500ms
  });
});
