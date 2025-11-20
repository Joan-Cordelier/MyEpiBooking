"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const logger_1 = require("./logger");
const generateToken = (userId, email) => {
    try {
        const payload = {
            userId,
            email,
        };
        const token = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, {
            expiresIn: env_1.env.JWT_EXPIRES_IN,
        });
        logger_1.logger.debug({ userId, email }, 'JWT token generated');
        return token;
    }
    catch (error) {
        logger_1.logger.error({ error, userId, email }, 'Failed to generate JWT token');
        throw new Error('Failed to generate authentication token');
    }
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        logger_1.logger.debug({ userId: decoded.userId }, 'JWT token verified');
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            logger_1.logger.warn('JWT token expired');
            throw new Error('Token expired');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            logger_1.logger.warn({ error: error.message }, 'Invalid JWT token');
            throw new Error('Invalid token');
        }
        logger_1.logger.error({ error }, 'JWT verification failed');
        throw new Error('Token verification failed');
    }
};
exports.verifyToken = verifyToken;
const decodeToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        return decoded;
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to decode JWT token');
        return null;
    }
};
exports.decodeToken = decodeToken;
