"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeValidate = exports.validate = exports.futureDateSchema = exports.floorSchema = exports.roomCapacitySchema = exports.roomNameSchema = exports.campusAddressSchema = exports.campusNameSchema = exports.urlSchema = exports.dateStringSchema = exports.positiveIntSchema = exports.uuidSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z
    .string()
    .email('Invalid email format')
    .min(3, 'Email must be at least 3 characters')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim();
exports.passwordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');
exports.uuidSchema = zod_1.z.string().uuid('Invalid UUID format');
exports.positiveIntSchema = zod_1.z.number().int().positive('Must be a positive integer');
exports.dateStringSchema = zod_1.z.string().datetime('Invalid date format. Expected ISO 8601 datetime string');
exports.urlSchema = zod_1.z.string().url('Invalid URL format');
// Campus validation schemas
exports.campusNameSchema = zod_1.z
    .string()
    .min(2, 'Campus name must be at least 2 characters')
    .max(100, 'Campus name must not exceed 100 characters')
    .trim();
exports.campusAddressSchema = zod_1.z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must not exceed 255 characters')
    .trim();
// Room validation schemas
exports.roomNameSchema = zod_1.z
    .string()
    .min(1, 'Room name must be at least 1 character')
    .max(50, 'Room name must not exceed 50 characters')
    .trim();
exports.roomCapacitySchema = zod_1.z
    .number()
    .int()
    .positive('Capacity must be a positive number')
    .max(1000, 'Capacity must not exceed 1000');
exports.floorSchema = zod_1.z
    .number()
    .int()
    .min(-5, 'Floor must be between -5 and 100')
    .max(100, 'Floor must be between -5 and 100');
// not past date schema
exports.futureDateSchema = zod_1.z.coerce.date().refine((date) => date >= new Date(), {
    message: 'Date must be in the future',
});
// Helper function to validate data against a Zod schema
const validate = (schema, data) => {
    return schema.parse(data);
};
exports.validate = validate;
const safeValidate = (schema, data) => {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
};
exports.safeValidate = safeValidate;
