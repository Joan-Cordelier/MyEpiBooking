import { Router } from 'express';
import { z } from 'zod';
import * as inventoryController from '../controllers/inventory.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRights } from '../middleware/rights.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRight } from '@prisma/client';

const router = Router();

const createInventoryBodySchema = z.object({
    tables: z.number().int().min(0).max(100),
    chairs: z.number().int().min(0).max(500),
    hasBoard: z.boolean(),
    hasTV: z.boolean(),
    roomId: z.string().cuid('Invalid room ID'),
    notes: z.string().max(500).optional().nullable(),
});

const updateInventoryBodySchema = z.object({
    tables: z.number().int().min(0).max(100).optional(),
    chairs: z.number().int().min(0).max(500).optional(),
    hasBoard: z.boolean().optional(),
    hasTV: z.boolean().optional(),
    notes: z.string().max(500).optional().nullable(),
});

const inventoryIdParamsSchema = z.object({
    id: z.string().cuid('Invalid inventory ID'),
});

const roomIdParamsSchema = z.object({
    roomId: z.string().cuid('Invalid room ID'),
});

router.get(
    '/',
    authenticate,
    requireRights(UserRight.EDIT_RIGHTS),
    inventoryController.getAll
);
router.get(
    '/:id',
    validate({ params: inventoryIdParamsSchema }),
    inventoryController.getById
);
router.get(
    '/rooms/:roomId',
    validate({ params: roomIdParamsSchema }),
    inventoryController.getByRoomId
);
router.post(
    '/',
    authenticate,
    requireRights(UserRight.EDIT_ROOM),
    validate({ body: createInventoryBodySchema }),
    inventoryController.create
);
router.put(
    '/:id',
    authenticate,
    requireRights(UserRight.EDIT_ROOM),
    validate({ params: inventoryIdParamsSchema, body: updateInventoryBodySchema }),
    inventoryController.update
);
router.delete(
    '/:id',
    authenticate,
    requireRights(UserRight.EDIT_ROOM),
    validate({ params: inventoryIdParamsSchema }),
    inventoryController.deleteInventory
);

export default router;
