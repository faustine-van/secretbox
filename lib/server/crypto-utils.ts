
import { timingSafeEqual, randomBytes } from 'crypto';

/**
 * Securely clears a buffer from memory.
 *
 * @param buffer The buffer to clear.
 */
export function secureClear(buffer: Buffer): void {
  buffer.fill(0);
}

/**
 * Performs a constant-time comparison of two buffers.
 *
 * @param a The first buffer.
 * @param b The second buffer.
 * @returns True if the buffers are equal, false otherwise.
 */
export function constantTimeCompare(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

/**
 * Generates a secure random salt.
 *
 * @param length The length of the salt in bytes.
 * @returns A promise that resolves to the generated salt.
 */
export function generateSalt(length = 16): Buffer {
  return randomBytes(length);
}
