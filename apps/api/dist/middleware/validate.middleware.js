"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateParams = exports.validateBody = exports.validate = void 0;
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const validate = (schemas) => {
    return (req, _res, next) => {
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
            logger_1.logger.debug({
                path: req.path,
                method: req.method,
            }, 'Request validation passed');
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                logger_1.logger.warn({
                    path: req.path,
                    method: req.method,
                    errors: error.errors,
                }, 'Request validation failed');
            }
            next(error);
        }
    };
};
exports.validate = validate;
const validateBody = (schema) => {
    return (0, exports.validate)({ body: schema });
};
exports.validateBody = validateBody;
const validateParams = (schema) => {
    return (0, exports.validate)({ params: schema });
};
exports.validateParams = validateParams;
const validateQuery = (schema) => {
    return (0, exports.validate)({ query: schema });
};
exports.validateQuery = validateQuery;
