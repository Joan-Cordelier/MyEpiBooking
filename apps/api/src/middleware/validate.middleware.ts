import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger';

export interface ValidationSchemas {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            // Validate request body
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }

            // Validate request params
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }

            // Validate query parameters
            if (schemas.query) {
                req.query = schemas.query.parse(req.query);
            }

            logger.debug({
                path: req.path,
                method: req.method,
            }, 'Request validation passed');

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                logger.warn({
                    path: req.path,
                    method: req.method,
                    errors: error.errors,
                }, 'Request validation failed');
            }
            next(error);
        }
    };
};

export const validateBody = (schema: ZodSchema) => {
    return validate({ body: schema });
};

export const validateParams = (schema: ZodSchema) => {
    return validate({ params: schema });
};

export const validateQuery = (schema: ZodSchema) => {
    return validate({ query: schema });
};
