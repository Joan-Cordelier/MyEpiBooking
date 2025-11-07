import { z } from 'zod';

export const emailSchema = z
    .string()
    .email('Invalid email format')
    .min(3, 'Email must be at least 3 characters')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim();

export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    );

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const positiveIntSchema = z.number().int().positive('Must be a positive integer');

export const dateStringSchema = z.string().datetime('Invalid date format. Expected ISO 8601 datetime string');

export const urlSchema = z.string().url('Invalid URL format');

// Campus validation schemas

export const campusNameSchema = z
    .string()
    .min(2, 'Campus name must be at least 2 characters')
    .max(100, 'Campus name must not exceed 100 characters')
    .trim();

export const campusAddressSchema = z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must not exceed 255 characters')
    .trim();


// Room validation schemas

export const roomNameSchema = z
    .string()
    .min(1, 'Room name must be at least 1 character')
    .max(50, 'Room name must not exceed 50 characters')
    .trim();

export const roomCapacitySchema = z
    .number()
    .int()
    .positive('Capacity must be a positive number')
    .max(1000, 'Capacity must not exceed 1000');

export const floorSchema = z
    .number()
    .int()
    .min(-5, 'Floor must be between -5 and 100')
    .max(100, 'Floor must be between -5 and 100');



// not past date schema
export const futureDateSchema = z.coerce.date().refine(
    (date) => date >= new Date(),
    {
        message: 'Date must be in the future',
    }
);


// Helper function to validate data against a Zod schema

export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
    return schema.parse(data);
};

export const safeValidate = <T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } => {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
};
