import { Router } from 'express';
import { z } from 'zod';
import * as campusController from '../controllers/campus.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRights } from '../middleware/rights.middleware';
import { validate } from '../middleware/validate.middleware';
import { campusNameSchema, campusAddressSchema } from '../utils/validators';
import { UserRight } from '@prisma/client';

const router = Router();

const createCampusBodySchema = z.object({
    name: campusNameSchema,
    city: z.string().min(2).max(100).trim(),
    address: campusAddressSchema.optional(),
});
const updateCampusBodySchema = z.object({
    name: campusNameSchema.optional(),
    city: z.string().min(2).max(100).trim().optional(),
    address: campusAddressSchema.optional().nullable(),
});
const campusIdParamsSchema = z.object({
    id: z.string().cuid('Invalid campus ID'),
});

router.get('/', campusController.getAll);
router.get(
    '/:id',
    validate({ params: campusIdParamsSchema }),
    campusController.getById
);
router.post(
    '/',
    authenticate,
    requireRights(UserRight.EDIT_RIGHTS),
    validate({ body: createCampusBodySchema }),
    campusController.create
);
router.put(
    '/:id',
    authenticate,
    requireRights(UserRight.EDIT_RIGHTS),
    validate({ params: campusIdParamsSchema, body: updateCampusBodySchema }),
    campusController.update
);
router.delete(
    '/:id',
    authenticate,
    requireRights(UserRight.EDIT_RIGHTS),
    validate({ params: campusIdParamsSchema }),
    campusController.deleteCampus
);

export default router;
