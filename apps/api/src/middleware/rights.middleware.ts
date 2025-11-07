import { Request, Response, NextFunction } from 'express';
import { UserRight } from '@prisma/client';
import { AppError } from './error.middleware';
import { logger } from '../utils/logger';


export const requireRights = (...requiredRights: UserRight[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                throw new AppError(401, 'Authentication required');
            }
            const userRights = req.user.rights;
            const missingRights = requiredRights.filter(
                (right) => !userRights.includes(right)
            );

            if (missingRights.length > 0) {
                logger.warn({
                    userId: req.user.id,
                    requiredRights,
                    userRights,
                    missingRights,
                }, 'User lacks required permissions');

                throw new AppError(
                    403,
                    `Missing required permissions: ${missingRights.join(', ')}`
                );
            }
            logger.debug({
                userId: req.user.id,
                requiredRights,
            }, 'User has required permissions');
            next();
        } catch (error) {
            next(error);
        }
    };
};

export const requireAnyRight = (...requiredRights: UserRight[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                throw new AppError(401, 'Authentication required');
            }

            const userRights = req.user.rights;
            const hasAnyRight = requiredRights.some((right) =>
                userRights.includes(right)
            );

            if (!hasAnyRight) {
                logger.warn({
                    userId: req.user.id,
                    requiredRights,
                    userRights,
                }, 'User lacks any of the required permissions');

                throw new AppError(
                    403,
                    `Missing required permissions. Need one of: ${requiredRights.join(', ')}`
                );
            }
            logger.debug({
                userId: req.user.id,
                requiredRights,
            }, 'User has at least one required permission');
            next();
        } catch (error) {
            next(error);
        }
    };
};

export const requireSuperAdmin = requireRights(UserRight.EDIT_RIGHTS);

export const requireOwnershipOrRight = (
    getUserIdFromRequest: (req: Request) => string,
    adminRight: UserRight
) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                throw new AppError(401, 'Authentication required');
            }
            const resourceOwnerId = getUserIdFromRequest(req);
            const isOwner = req.user.id === resourceOwnerId;
            const hasAdminRight = req.user.rights.includes(adminRight);

            if (!isOwner && !hasAdminRight) {
                logger.warn({
                    userId: req.user.id,
                    resourceOwnerId,
                    adminRight,
                }, 'User is not owner and lacks admin rights');
                throw new AppError(
                    403,
                    'You do not have permission to access this resource'
                );
            }
            logger.debug({
                userId: req.user.id,
                isOwner,
                hasAdminRight,
            }, 'User has ownership or admin rights');
            next();
        } catch (error) {
            next(error);
        }
    };
};
