"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pino_http_1 = __importDefault(require("pino-http"));
const env_1 = require("./config/env");
const cors_2 = require("./config/cors");
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
const error_middleware_1 = require("./middleware/error.middleware");
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
const startTime = Date.now();
app.use((0, cors_1.default)(cors_2.corsConfig));
app.use((0, pino_http_1.default)({ logger: logger_1.logger }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', index_1.default);
app.get('/health', async (_req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    let dbStatus = 'ok';
    let dbMessage = 'Connected';
    try {
        await database_1.prisma.$queryRaw `SELECT 1`;
    }
    catch (error) {
        dbStatus = 'error';
        dbMessage = 'Database connection failed';
        logger_1.logger.error({ error }, 'Health check: Database connection failed');
    }
    const isHealthy = dbStatus === 'ok';
    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json({
        status: isHealthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: `${uptime}s`,
        environment: env_1.env.NODE_ENV,
        checks: {
            database: {
                status: dbStatus,
                message: dbMessage,
            },
        },
    });
});
app.get('/api', (_req, res) => {
    res.status(200).json({
        name: 'MyEpiBooking API',
        version: '1.0.0',
        description: 'Room booking system for Epitech campuses',
        environment: env_1.env.NODE_ENV,
        endpoints: {
            health: 'GET /health',
            info: 'GET /api',
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            me: 'GET /api/auth/me',
            campuses: 'GET /api/campus',
            createCampus: 'POST /api/campus',
            updateCampus: 'PUT /api/campus/:id',
            deleteCampus: 'DELETE /api/campus/:id',
            rooms: 'GET /api/rooms',
            createRoom: 'POST /api/rooms',
            updateRoom: 'PUT /api/rooms/:id',
            updateRoomState: 'PATCH /api/rooms/:id/state',
            deleteRoom: 'DELETE /api/rooms/:id',
            inventories: 'GET /api/inventories',
            inventoryById: 'GET /api/inventories/:id',
            inventoryByRoom: 'GET /api/inventories/rooms/:roomId',
            createInventory: 'POST /api/inventories',
            updateInventory: 'PUT /api/inventories/:id',
            deleteInventory: 'DELETE /api/inventories/:id',
            reservations: 'GET /api/reservations',
            myReservations: 'GET /api/reservations/me',
            roomReservations: 'GET /api/reservations/rooms/:roomId',
            reservationById: 'GET /api/reservations/:id',
            createReservation: 'POST /api/reservations',
            updateReservation: 'PUT /api/reservations/:id',
            deleteReservation: 'DELETE /api/reservations/:id',
            users: 'GET /api/users',
            userById: 'GET /api/users/:id',
            createUser: 'POST /api/users',
            updateUser: 'PUT /api/users/:id',
            updateUserRights: 'PATCH /api/users/:id/rights',
            deleteUser: 'DELETE /api/users/:id',
        },
    });
});
app.use(error_middleware_1.errorHandler);
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        logger_1.logger.info('Database connected successfully');
        const server = app.listen(env_1.env.PORT, () => {
            logger_1.logger.info({
                port: env_1.env.PORT,
                environment: env_1.env.NODE_ENV,
            }, `Server is running on http://localhost:${env_1.env.PORT}`);
            logger_1.logger.info(`Health check available at http://localhost:${env_1.env.PORT}/health`);
            logger_1.logger.info(`API info available at http://localhost:${env_1.env.PORT}/api`);
        });
        const Shutdown = async (signal) => {
            logger_1.logger.info(`${signal} received, starting  shutdown...`);
            server.close(async () => {
                logger_1.logger.info('HTTP server closed');
                try {
                    await (0, database_1.disconnectDatabase)();
                    logger_1.logger.info('Database disconnected');
                    logger_1.logger.info(' shutdown completed');
                    process.exit(0);
                }
                catch (error) {
                    logger_1.logger.error({ error }, 'Error during shutdown');
                    process.exit(1);
                }
            });
            setTimeout(() => {
                logger_1.logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => Shutdown('SIGTERM'));
        process.on('SIGINT', () => Shutdown('SIGINT'));
    }
    catch (error) {
        logger_1.logger.error({ error }, 'Failed to start server');
        process.exit(1);
    }
};
startServer();
exports.default = app;
