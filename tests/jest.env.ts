// tests/jest.env.ts
import { TextEncoder, TextDecoder } from 'util';

// Polyfill Web APIs for Jest environment
Object.defineProperty(globalThis, 'TextEncoder', {
  value: TextEncoder,
});

Object.defineProperty(globalThis, 'TextDecoder', {
  value: TextDecoder,
});

// Polyfill ReadableStream and other Web APIs
import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web';
import { Blob } from 'buffer';

Object.defineProperty(globalThis, 'ReadableStream', {
  value: ReadableStream,
});

Object.defineProperty(globalThis, 'WritableStream', {
  value: WritableStream,
});

Object.defineProperty(globalThis, 'TransformStream', {
  value: TransformStream,
});

Object.defineProperty(globalThis, 'Blob', {
  value: Blob,
});

import { MessagePort } from 'node:worker_threads';

Object.defineProperty(globalThis, 'MessagePort', {
  value: MessagePort,
});

// Polyfill fetch if not available
if (!globalThis.fetch) {
  const { fetch, Request, Response, Headers, FormData } = require('undici');
  Object.defineProperty(globalThis, 'fetch', { value: fetch });
  Object.defineProperty(globalThis, 'Request', { value: Request });
  Object.defineProperty(globalThis, 'Response', { value: Response });
  Object.defineProperty(globalThis, 'Headers', { value: Headers });
  Object.defineProperty(globalThis, 'FormData', { value: FormData });
}