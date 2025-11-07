import pino from 'pino';
import { env } from '../config/env';

const getLogLevel = (): string => {
    switch (env.NODE_ENV) {
        case 'production':
            return 'info';
        case 'test':
            return 'silent';
        case 'development':
        default:
            return 'debug';
    }
};

export const logger = pino({
    level: env.LOG_LEVEL || getLogLevel(),
    transport:
        env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                },
            }
            : undefined,
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});

export const createLogger = (bindings: Record<string, unknown>) => {
    return logger.child(bindings);
};

export default logger;
