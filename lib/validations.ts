import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is required' }),
  masterPassword: z.string()
    .min(6, { message: 'Master password must be at least 6 characters' })
    .max(128, { message: 'Master password must be less than 128 characters' })
    .optional(), // Optional for first-step login  
});

export const RegisterSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be less than 255 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  
  masterPassword: z.string()
    .min(12, 'Master password must be at least 12 characters')
    .max(128, 'Master password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, 
      'Master password must contain uppercase, lowercase, number, and special character')
    .refine(password => !/(.)\1{2,}/.test(password), 
      'Master password cannot contain repeating characters')
});

export const MasterPasswordSchema = z.object({
  masterPassword: z.string().min(12, { message: 'Master password must be at least 12 characters' }),
});


export const SessionSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  loggedInAt: z.number(),
});


export const CreateKeySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  value: z.string().min(1, { message: "Value is required" }),
  key_type: z.enum(['api_key', 'database', 'token', 'credential', 'other']),
  collectionId: z.preprocess((val) => {
    if (!val || val === '') return undefined;
    return String(val);
  }, z.string().optional()),

  description: z.string().max(500).optional(),

  expiresAt: z.preprocess((val) => {
    if (!val || val === '') return undefined;
    return new Date(val as string);
  }, z.date().optional()),
});


export const UpdateKeySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  value: z.string().min(1, { message: "Value is required" }).optional(),
  collectionId: z.preprocess((arg) => {
    if (!arg || arg === '') return undefined;
    return arg;
  }, z.string().uuid().optional()),
  key_type: z.enum(["api_key", "secret", "token", "credential"]).optional(),
  expiresAt: z.preprocess((arg) => {
    if (!arg || arg === '') return undefined;
    return arg;
  }, z.coerce.date().optional()),
});

export const KeySearchSchema = z.object({
  query: z.string().optional(),
  collectionId: z.string().uuid().optional(),
  type: z.enum(["api_key", "secret", "token", "credential"]).optional(),
  sortBy: z.enum(["name", "createdAt", "lastAccessedAt"]).optional(),
  page: z.number().optional(),
});


export const KeyRevealSchema = z.object({
  masterPassword: z.string().min(1, { message: "Master password is required" }),
});

export const CreateCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').default('#10b981'),
  icon: z.enum(['folder', 'lock', 'server', 'globe', 'database', 'cloud', 'shield', 'users', 'settings']).default('folder'),
  category: z.enum(['production', 'staging', 'development', 'testing', 'personal', 'shared']).optional(),
  tags: z.string().optional(),
});

export const UpdateCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(50, 'Name too long').optional(),
  description: z.string().max(200, 'Description too long').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  icon: z.enum(['folder', 'lock', 'server', 'globe', 'database', 'cloud', 'shield', 'users', 'settings']).optional(),
  category: z.enum(['production', 'staging', 'development', 'testing', 'personal', 'shared']).optional(),
  tags: z.string().optional(),
});