
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { audit } from '@/lib/server/audit';
import { EncryptionResult } from '@/types/supabase';

const ivLength = 16;
const saltLength = 16;
const keyLength = 32;
const algorithm = 'aes-256-gcm';

/**
 * Encrypts a plaintext value using AES-256-GCM.
 *
 * @param plaintext The value to encrypt.
 * @param secretKey The secret key to use for encryption.
 * @returns A promise that resolves to an object containing the encrypted value, IV, and auth tag.
 */
export async function encrypt(plaintext: string, secretKey: string): Promise<EncryptionResult> {
  const startTime = Date.now();
  try {
    const iv = randomBytes(ivLength);
    const salt = randomBytes(saltLength);
    const key = (await promisify(scrypt)(secretKey, salt, keyLength)) as Buffer;

    const cipher = createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const result: EncryptionResult = {
      encryptedValue: encrypted.toString('hex'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      salt: salt.toString('hex'),
    };

    await audit({
      action: 'encrypt',
      success: true,
      duration: Date.now() - startTime,
      user_id: secretKey,
      resource_type: 'key',
      resource_id: null,
      ip_address: null,
      user_agent: null,
      metadata: {},
    });
    return result;
  } catch (error) {
    await audit({
      action: 'encrypt',
      success: false,
      duration: Date.now() - startTime,
      user_id: secretKey,
      resource_type: 'key',
      resource_id: null,
      ip_address: null,
      user_agent: null,
      metadata: { error: (error as Error).message },
    });
    throw new Error('Encryption failed.');
  }
}

/**
 * Decrypts an encrypted value using AES-256-GCM.
 *
 * @param encryptedValue The encrypted value.
 * @param iv The initialization vector.
 * @param authTag The authentication tag.
 * @param salt The salt.
 * @param secretKey The secret key to use for decryption.
 * @returns A promise that resolves to the decrypted plaintext.
 */
export async function decrypt(encryptedValue: string, iv: string, authTag: string, salt: string, secretKey: string): Promise<string> {
  const startTime = Date.now();
  try {
    const key = (await promisify(scrypt)(secretKey, Buffer.from(salt, 'hex'), keyLength)) as Buffer;
    const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedValue, 'hex')), decipher.final()]);

    await audit({
      action: 'decrypt',
      success: true,
      duration: Date.now() - startTime,
      user_id: secretKey,
      resource_type: 'key',
      resource_id: null,
      ip_address: null,
      user_agent: null,
      metadata: {},
    });
    return decrypted.toString('utf8');
  } catch (error) {
    await audit({
      action: 'decrypt',
      success: false,
      duration: Date.now() - startTime,
      user_id: secretKey,
      resource_type: 'key',
      resource_id: null,
      ip_address: null,
      user_agent: null,
      metadata: { error: (error as Error).message },
    });
    throw new Error(`Decryption failed: ${(error as Error).message}`);
  }
}
