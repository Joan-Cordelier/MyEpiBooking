import { Router } from 'express';
import { z } from 'zod';
import * as roomController from '../controllers/room.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRights } from '../middleware/rights.middleware';
import { validate } from '../middleware/validate.middleware';
import { roomNameSchema, roomCapacitySchema } from '../utils/validators';
import { UserRight, RoomState } from '@prisma/client';

const router = Router();

const createRoomBodySchema = z.object({
    name: roomNameSchema,
    floor: z.string().min(1).max(10).trim(),
    capacity: roomCapacitySchema,
    description: z.string().min(1).max(500).trim(),
    campusId: z.string().cuid('Invalid campus ID'),
    state: z.nativeEnum(RoomState).optional(),
});

const updateRoomBodySchema = z.object({
    name: roomNameSchema.optional(),
    floor: z.string().min(1).max(10).trim().optional(),
    capacity: roomCapacitySchema.optional(),
    description: z.string().min(1).max(500).trim().optional(),
    campusId: z.string().cuid('Invalid campus ID').optional(),
    state: z.nativeEnum(RoomState).optional(),
});

const updateStateBodySchema = z.object({
    state: z.nativeEnum(RoomState),
});

const roomIdParamsSchema = z.object({
    id: z.string().cuid('Invalid room ID'),
});

router.get('/', roomController.getAll);
router.get(
    '/:id',
    validate({ params: roomIdParamsSchema }),
    roomController.getById
);
router.post(
    '/',
    authenticate,
    requireRights(UserRight.EDIT_ROOM),
    validate({ body: createRoomBodySchema }),
    roomController.create
);
router.put(
    '/:id',
    authenticate,
    requireRights(UserRight.EDIT_ROOM),
    validate({ params: roomIdParamsSchema, body: updateRoomBodySchema }),
    roomController.update
);
router.patch(
    '/:id/state',
    authenticate,
    requireRights(UserRight.EDIT_ROOM),
    validate({ params: roomIdParamsSchema, body: updateStateBodySchema }),
    roomController.updateState
);
router.delete(
    '/:id',
    authenticate,
    requireRights(UserRight.EDIT_ROOM),
    validate({ params: roomIdParamsSchema }),
    roomController.deleteRoom
);

export default router;
