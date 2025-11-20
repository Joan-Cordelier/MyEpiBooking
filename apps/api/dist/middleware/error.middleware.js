"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.AppError = exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, _next) => {
    logger_1.logger.error({
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    }, 'Error occurred');
    if (err instanceof zod_1.ZodError) {
        const response = {
            error: 'Validation Error',
            message: 'Invalid request data',
            details: err.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            })),
            statusCode: 400,
        };
        res.status(400).json(response);
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const response = handlePrismaError(err);
        res.status(response.statusCode).json(response);
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        const response = {
            error: 'Validation Error',
            message: 'Invalid data provided to database',
            statusCode: 400,
        };
        res.status(400).json(response);
        return;
    }
    if ('statusCode' in err && typeof err.statusCode === 'number') {
        const response = {
            error: err.name || 'Error',
            message: err.message,
            statusCode: err.statusCode,
        };
        res.status(err.statusCode).json(response);
        return;
    }
    const response = {
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message,
        statusCode: 500,
    };
    res.status(500).json(response);
};
exports.errorHandler = errorHandler;
function handlePrismaError(err) {
    switch (err.code) {
        case 'P2000':
            return {
                error: 'Validation Error',
                message: 'The provided value is too long for the field',
                details: err.meta,
                statusCode: 400,
            };
        case 'P2001':
            return {
                error: 'Not Found',
                message: 'The record does not exist',
                details: err.meta,
                statusCode: 404,
            };
        case 'P2002':
            return {
                error: 'Conflict',
                message: `A record with this ${err.meta?.target?.join(', ') || 'value'} already exists`,
                details: err.meta,
                statusCode: 409,
            };
        case 'P2003':
            return {
                error: 'Bad Request',
                message: 'Invalid foreign key reference',
                details: err.meta,
                statusCode: 400,
            };
        case 'P2025':
            return {
                error: 'Not Found',
                message: 'Record not found or operation failed',
                details: err.meta,
                statusCode: 404,
            };
        default:
            return {
                error: 'Database Error',
                message: 'A database error occurred',
                details: process.env.NODE_ENV === 'development' ? err.meta : undefined,
                statusCode: 500,
            };
    }
}
class AppError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
