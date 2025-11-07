import { Router } from 'express';
import { z } from 'zod';
import * as reservationController from '../controllers/reservation.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRights } from '../middleware/rights.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRight } from '@prisma/client';
import * as reservationService from '../services/reservation.service';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Zod schemas
const createReservationSchema = z.object({
    type: z.enum(['MEETING', 'WORKSHOP', 'LECTURE', 'EXAM', 'OTHER']),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    roomId: z.string().cuid(),
});

const updateReservationSchema = z.object({
    type: z.enum(['MEETING', 'WORKSHOP', 'LECTURE', 'EXAM', 'OTHER']).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    roomId: z.string().cuid().optional(),
});

const idParamSchema = z.object({
    id: z.string().cuid(),
});

const roomIdParamSchema = z.object({
    roomId: z.string().cuid(),
});

const dateRangeQuerySchema = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

const checkOwnership = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            throw new AppError(401, 'Authentication required');
        }

        const reservationId = req.params.id;
        const userId = req.user.id;
        const userRights = req.user.rights || [];

        if (userRights.includes(UserRight.EDIT_RESERVATION)) {
            return next();
        }

        const reservation = await reservationService.getById(reservationId);

        if (reservation.userId !== userId) {
            throw new AppError(403, 'You can only modify your own reservations');
        }

        next();
    } catch (error) {
        next(error);
    }
};

router.get(
    '/',
    authenticate,
    reservationController.getAll
);
router.get(
    '/me',
    authenticate,
    reservationController.getMyReservations
);
router.get(
    '/rooms/:roomId',
    authenticate,
    validate({ params: roomIdParamSchema, query: dateRangeQuerySchema }),
    reservationController.getRoomReservations
);
router.get(
    '/:id',
    authenticate,
    validate({ params: idParamSchema }),
    reservationController.getById
);
router.post(
    '/',
    authenticate,
    requireRights(UserRight.BOOK_ROOM),
    validate({ body: createReservationSchema }),
    reservationController.create
);
router.put(
    '/:id',
    authenticate,
    validate({ params: idParamSchema, body: updateReservationSchema }),
    checkOwnership,
    reservationController.update
);
router.delete(
    '/:id',
    authenticate,
    validate({ params: idParamSchema }),
    checkOwnership,
    reservationController.deleteReservation
);

export default router;
