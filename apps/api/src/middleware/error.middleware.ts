import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export interface ErrorResponse {
    error: string;
    message: string;
    details?: unknown;
    statusCode: number;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    logger.error({
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    }, 'Error occurred');

    if (err instanceof ZodError) {
        const response: ErrorResponse = {
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

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const response = handlePrismaError(err);
        res.status(response.statusCode).json(response);
        return;
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        const response: ErrorResponse = {
            error: 'Validation Error',
            message: 'Invalid data provided to database',
            statusCode: 400,
        };
        res.status(400).json(response);
        return;
    }

    if ('statusCode' in err && typeof err.statusCode === 'number') {
        const response: ErrorResponse = {
            error: err.name || 'Error',
            message: err.message,
            statusCode: err.statusCode,
        };
        res.status(err.statusCode).json(response);
        return;
    }

    const response: ErrorResponse = {
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' 
            ? 'An unexpected error occurred' 
            : err.message,
        statusCode: 500,
    };
    res.status(500).json(response);
};

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): ErrorResponse {
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
                message: `A record with this ${(err.meta?.target as string[])?.join(', ') || 'value'} already exists`,
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

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
