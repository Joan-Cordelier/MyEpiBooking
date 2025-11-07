import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from './logger';

export interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export const generateToken = (userId: string, email: string): string => {
    try {
        const payload: JwtPayload = {
            userId,
            email,
        };

        const token = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
        } as jwt.SignOptions);

        logger.debug({ userId, email }, 'JWT token generated');
        return token;
    } catch (error) {
        logger.error({ error, userId, email }, 'Failed to generate JWT token');
        throw new Error('Failed to generate authentication token');
    }
};

export const verifyToken = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        logger.debug({ userId: decoded.userId }, 'JWT token verified');
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn('JWT token expired');
            throw new Error('Token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            logger.warn({ error: error.message }, 'Invalid JWT token');
            throw new Error('Invalid token');
        }
        logger.error({ error }, 'JWT verification failed');
        throw new Error('Token verification failed');
    }
};

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    } catch (error) {
        logger.error({ error }, 'Failed to decode JWT token');
        return null;
    }
};
