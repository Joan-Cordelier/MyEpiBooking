"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnershipOrRight = exports.requireSuperAdmin = exports.requireAnyRight = exports.requireRights = void 0;
const client_1 = require("@prisma/client");
const error_middleware_1 = require("./error.middleware");
const logger_1 = require("../utils/logger");
const requireRights = (...requiredRights) => {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw new error_middleware_1.AppError(401, 'Authentication required');
            }
            const userRights = req.user.rights;
            const missingRights = requiredRights.filter((right) => !userRights.includes(right));
            if (missingRights.length > 0) {
                logger_1.logger.warn({
                    userId: req.user.id,
                    requiredRights,
                    userRights,
                    missingRights,
                }, 'User lacks required permissions');
                throw new error_middleware_1.AppError(403, `Missing required permissions: ${missingRights.join(', ')}`);
            }
            logger_1.logger.debug({
                userId: req.user.id,
                requiredRights,
            }, 'User has required permissions');
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireRights = requireRights;
const requireAnyRight = (...requiredRights) => {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw new error_middleware_1.AppError(401, 'Authentication required');
            }
            const userRights = req.user.rights;
            const hasAnyRight = requiredRights.some((right) => userRights.includes(right));
            if (!hasAnyRight) {
                logger_1.logger.warn({
                    userId: req.user.id,
                    requiredRights,
                    userRights,
                }, 'User lacks any of the required permissions');
                throw new error_middleware_1.AppError(403, `Missing required permissions. Need one of: ${requiredRights.join(', ')}`);
            }
            logger_1.logger.debug({
                userId: req.user.id,
                requiredRights,
            }, 'User has at least one required permission');
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireAnyRight = requireAnyRight;
exports.requireSuperAdmin = (0, exports.requireRights)(client_1.UserRight.EDIT_RIGHTS);
const requireOwnershipOrRight = (getUserIdFromRequest, adminRight) => {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw new error_middleware_1.AppError(401, 'Authentication required');
            }
            const resourceOwnerId = getUserIdFromRequest(req);
            const isOwner = req.user.id === resourceOwnerId;
            const hasAdminRight = req.user.rights.includes(adminRight);
            if (!isOwner && !hasAdminRight) {
                logger_1.logger.warn({
                    userId: req.user.id,
                    resourceOwnerId,
                    adminRight,
                }, 'User is not owner and lacks admin rights');
                throw new error_middleware_1.AppError(403, 'You do not have permission to access this resource');
            }
            logger_1.logger.debug({
                userId: req.user.id,
                isOwner,
                hasAdminRight,
            }, 'User has ownership or admin rights');
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireOwnershipOrRight = requireOwnershipOrRight;
