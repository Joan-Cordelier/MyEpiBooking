import zod from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = zod.object({
    // Database Configuration
    DATABASE_URL: zod.string().url({
        message: 'DATABASE_URL must be a valid database connection string',
    }),

    // Server Configuration
    PORT: zod
        .string()
        .regex(/^\d+$/, 'PORT must be a numeric string')
        .transform(Number)
        .pipe(zod.number().int().min(1).max(65535))
        .default('3000'),

    NODE_ENV: zod
        .enum(['development', 'production', 'test'])
        .default('development'),

    // JWT Configuration
    JWT_SECRET: zod
        .string()
        .min(32, 'JWT_SECRET must be at least 32 characters for security'),

    JWT_EXPIRES_IN: zod
        .string()
        .regex(/^\d+[smhd]$/, 'JWT_EXPIRES_IN must be a valid time string (e.g., 1h, 7d)')
        .default('24h'),

    // CORS Configuration
    ALLOWED_ORIGINS: zod
        .string()
        .min(1, 'ALLOWED_ORIGINS must contain at least one origin')
        .transform((str) => str.split(',').map((origin) => origin.trim())),

    // Redis Configuration
    REDIS_URL: zod
        .string()
        .url({ message: 'REDIS_URL must be a valid Redis connection string' })
        .optional(),

    // Logging Configuration
    LOG_LEVEL: zod
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
        .optional(),

    // Microsoft OAuth2 Configuration
    MICROSOFT_CLIENT_ID: zod
        .string()
        .min(1, 'MICROSOFT_CLIENT_ID is required for OAuth authentication')
        .optional(),

    MICROSOFT_CLIENT_SECRET: zod
        .string()
        .min(1, 'MICROSOFT_CLIENT_SECRET is required for OAuth authentication')
        .optional(),

    MICROSOFT_TENANT_ID: zod
        .string()
        .optional(),

    FRONTEND_URL: zod
        .string()
        .url({ message: 'FRONTEND_URL must be a valid URL' })
        .default('http://localhost:3000'),
});

const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof zod.ZodError) {
            console.error('Environment variable validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;}
};

export const env = parseEnv();

export type Env = zod.infer<typeof envSchema>;

export default env;
