import express, { Request, Response } from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { corsConfig } from './config/cors';
import { connectDatabase, disconnectDatabase, prisma } from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import campusRoutes from './routes/campus.routes';
import roomRoutes from './routes/room.routes';
import inventoryRoutes from './routes/inventory.routes';
import reservationRoutes from './routes/reservation.routes';
import userRoutes from './routes/user.routes';

const app = express();

const startTime = Date.now();

app.use(cors(corsConfig));
app.use(pinoHttp({ logger }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/campus', campusRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

app.get('/health', async (_req: Request, res: Response) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    let dbStatus = 'ok';
    let dbMessage = 'Connected';

    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
        dbStatus = 'error';
        dbMessage = 'Database connection failed';
        logger.error({ error }, 'Health check: Database connection failed');
    }    
    const isHealthy = dbStatus === 'ok';
    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json({
        status: isHealthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: `${uptime}s`,
        environment: env.NODE_ENV,
        checks: {
            database: {
                status: dbStatus,
                message: dbMessage,
            },
        },
    });
});

app.get('/api', (_req: Request, res: Response) => {
    res.status(200).json({
        name: 'MyEpiBooking API',
        version: '1.0.0',
        description: 'Room booking system for Epitech campuses',
        environment: env.NODE_ENV,
        endpoints: {
            health: 'GET /health',
            info: 'GET /api',
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

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDatabase();
        logger.info('Database connected successfully');
        const server = app.listen(env.PORT, () => {
            logger.info({
                port: env.PORT,
                environment: env.NODE_ENV,
            }, `Server is running on http://localhost:${env.PORT}`);
            logger.info(`Health check available at http://localhost:${env.PORT}/health`);
            logger.info(`API info available at http://localhost:${env.PORT}/api`);
        });

        const Shutdown = async (signal: string) => {
            logger.info(`${signal} received, starting  shutdown...`);
            
            server.close(async () => {
                logger.info('HTTP server closed');
                try {
                    await disconnectDatabase();
                    logger.info('Database disconnected');
                    logger.info(' shutdown completed');
                    process.exit(0);
                } catch (error) {
                    logger.error({ error }, 'Error during shutdown');
                    process.exit(1);
                }
            });
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => Shutdown('SIGTERM'));
        process.on('SIGINT', () => Shutdown('SIGINT'));
    } catch (error) {
        logger.error({ error }, 'Failed to start server');
        process.exit(1);
    }
};

startServer();

export default app;
