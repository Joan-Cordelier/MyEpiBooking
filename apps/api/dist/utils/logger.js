"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const env_1 = require("../config/env");
const getLogLevel = () => {
    switch (env_1.env.NODE_ENV) {
        case 'production':
            return 'info';
        case 'test':
            return 'silent';
        case 'development':
        default:
            return 'debug';
    }
};
exports.logger = (0, pino_1.default)({
    level: env_1.env.LOG_LEVEL || getLogLevel(),
    transport: env_1.env.NODE_ENV === 'development'
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
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
});
const createLogger = (bindings) => {
    return exports.logger.child(bindings);
};
exports.createLogger = createLogger;
exports.default = exports.logger;
