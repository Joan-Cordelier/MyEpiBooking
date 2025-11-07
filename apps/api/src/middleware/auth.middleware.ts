import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { AppError } from './error.middleware';
import { UserRight } from '@prisma/client';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                rights: UserRight[];
            };
        }
    }
}

export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(401, 'No authentication token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer '
        let decoded: JwtPayload;
        try {
            decoded = verifyToken(token);
        } catch (error) {
            if (error instanceof Error) {
                throw new AppError(401, error.message);
            }
            throw new AppError(401, 'Invalid authentication token');
        }
        const user = await prisma.user.findUnique({
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
            logger.warn({ userId: decoded.userId }, 'User not found for valid token');
            throw new AppError(401, 'User not found');
        }
        req.user = {
            id: user.id,
            email: user.email,
            rights: user.rights.map((r) => r.right),
        };
        logger.debug({ userId: user.id }, 'User authenticated');
        next();
    } catch (error) {
        next(error);
    }
};

export const optionalAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }

        const token = authHeader.substring(7);

        try {
            const decoded = verifyToken(token);
            const user = await prisma.user.findUnique({
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
        } catch (error) {
            // Invalid token, continue without user
            logger.debug('Invalid token in optional auth, continuing without user');
        }
        next();
    } catch (error) {
        next(error);
    }
};
