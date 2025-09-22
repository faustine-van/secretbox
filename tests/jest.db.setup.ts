
import { config } from 'dotenv';
import { existsSync } from 'fs';

const envPath = '.env.test';
if (!existsSync(envPath)) {
  throw new Error(`Test environment file ${envPath} not found. Please create it from .env.test.example`);
}

const result = config({ path: envPath });
if (result.error) {
  throw new Error(`Failed to load test environment: ${result.error.message}`);
}
