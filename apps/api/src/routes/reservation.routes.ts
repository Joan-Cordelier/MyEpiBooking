import { Router } from 'express';
import { z } from 'zod';
import * as reservationController from '../controllers/reservation.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRights, requireOwnershipOrRight } from '../middleware/rights.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRight } from '@prisma/client';
import * as reservationService from '../services/reservation.service';

const router = Router();

// Zod schemas
const createReservationSchema = z.object({
    type: z.enum(['MEETING', 'WORK', 'KICK_OFF', 'BOOTSTRAP', 'WORKSHOP', 'TALK', 'UNEXPECTED']),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    roomId: z.string().cuid(),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "Start date must be before end date",
    path: ["endDate"],
});

const updateReservationSchema = z.object({
    type: z.enum(['MEETING', 'WORK', 'KICK_OFF', 'BOOTSTRAP', 'WORKSHOP', 'TALK', 'UNEXPECTED']).optional(),
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    roomId: z.string().cuid().optional(),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
}, {
    message: "Start date must be before end date",
    path: ["endDate"],
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

const paginationQuerySchema = z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    userId: z.string().cuid().optional(),
    roomId: z.string().cuid().optional(),
    type: z.enum(['MEETING', 'WORK', 'KICK_OFF', 'BOOTSTRAP', 'WORKSHOP', 'TALK', 'UNEXPECTED']).optional(),
});

// Middleware: user can edit their own reservation or have EDIT_RESERVATION right
const requireOwnershipOrEditRight = requireOwnershipOrRight(
    async (req) => {
        const reservation = await reservationService.getById(req.params.id);
        return reservation.userId;
    },
    UserRight.EDIT_RESERVATION
);

router.get(
    '/',
    authenticate,
    validate({ query: paginationQuerySchema }),
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
    requireOwnershipOrEditRight,
    reservationController.update
);
router.delete(
    '/:id',
    authenticate,
    validate({ params: idParamSchema }),
    requireOwnershipOrEditRight,
    reservationController.deleteReservation
);

export default router;
