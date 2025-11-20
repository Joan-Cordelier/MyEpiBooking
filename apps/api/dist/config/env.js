"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.default.object({
    // Database Configuration
    DATABASE_URL: zod_1.default.string().url({
        message: 'DATABASE_URL must be a valid database connection string',
    }),
    // Server Configuration
    PORT: zod_1.default
        .string()
        .regex(/^\d+$/, 'PORT must be a numeric string')
        .transform(Number)
        .pipe(zod_1.default.number().int().min(1).max(65535))
        .default('3000'),
    NODE_ENV: zod_1.default
        .enum(['development', 'production', 'test'])
        .default('development'),
    // JWT Configuration
    JWT_SECRET: zod_1.default
        .string()
        .min(32, 'JWT_SECRET must be at least 32 characters for security'),
    JWT_EXPIRES_IN: zod_1.default
        .string()
        .regex(/^\d+[smhd]$/, 'JWT_EXPIRES_IN must be a valid time string (e.g., 1h, 7d)')
        .default('24h'),
    // CORS Configuration
    ALLOWED_ORIGINS: zod_1.default
        .string()
        .min(1, 'ALLOWED_ORIGINS must contain at least one origin')
        .transform((str) => str.split(',').map((origin) => origin.trim())),
    // Redis Configuration
    REDIS_URL: zod_1.default
        .string()
        .url({ message: 'REDIS_URL must be a valid Redis connection string' })
        .optional(),
    // Logging Configuration
    LOG_LEVEL: zod_1.default
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
        .optional(),
});
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            console.error('Environment variable validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};
exports.env = parseEnv();
exports.default = exports.env;
