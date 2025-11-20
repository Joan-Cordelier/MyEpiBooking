"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const database_1 = require("../config/database");
const logger_1 = require("../utils/logger");
const error_middleware_1 = require("./error.middleware");
const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new error_middleware_1.AppError(401, 'No authentication token provided');
        }
        const token = authHeader.substring(7); // Remove 'Bearer '
        let decoded;
        try {
            decoded = (0, jwt_1.verifyToken)(token);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new error_middleware_1.AppError(401, error.message);
            }
            throw new error_middleware_1.AppError(401, 'Invalid authentication token');
        }
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                rights: {
                    select: {
                        right: true,
                    },
                },
            },
        });
        if (!user) {
            logger_1.logger.warn({ userId: decoded.userId }, 'User not found for valid token');
            throw new error_middleware_1.AppError(401, 'User not found');
        }
        req.user = {
            id: user.id,
            email: user.email,
            rights: user.rights.map((r) => r.right),
        };
        logger_1.logger.debug({ userId: user.id }, 'User authenticated');
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        try {
            const decoded = (0, jwt_1.verifyToken)(token);
            const user = await database_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    rights: {
                        select: {
                            right: true,
                        },
                    },
                },
            });
            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    rights: user.rights.map((r) => r.right),
                };
            }
        }
        catch (error) {
            // Invalid token, continue without user
            logger_1.logger.debug('Invalid token in optional auth, continuing without user');
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.optionalAuth = optionalAuth;
