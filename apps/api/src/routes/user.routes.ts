import { Router } from 'express';
import { z } from 'zod';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRights, requireOwnershipOrRight } from '../middleware/rights.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRight } from '@prisma/client';

const router = Router();

// Zod schemas
const createUserSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(8),
    name: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    actual_promotion: z.string().trim().optional(),
    photo: z.string().url().optional(),
    campusId: z.string().cuid().optional(),
    rights: z.array(z.nativeEnum(UserRight)).optional(),
});

const updateUserSchema = z.object({
    email: z.string().trim().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    actual_promotion: z.string().trim().optional(),
    photo: z.string().url().optional(),
    campusId: z.string().cuid().optional().nullable(),
});

const updateRightsSchema = z.object({
    rights: z.array(z.nativeEnum(UserRight)),
});

const idParamSchema = z.object({
    id: z.string().cuid(),
});

// Middleware: user can access their own profile or have EDIT_RIGHTS
const checkSelfOrAdmin = requireOwnershipOrRight(
    (req) => req.params.id,
    UserRight.EDIT_RIGHTS
);

router.get(
    '/',
    authenticate,
    requireRights(UserRight.EDIT_RIGHTS),
    userController.getAll
);
router.get(
    '/:id',
    authenticate,
    validate({ params: idParamSchema }),
    checkSelfOrAdmin,
    userController.getById
);
router.post(
    '/',
    authenticate,
    requireRights(UserRight.EDIT_RIGHTS),
    validate({ body: createUserSchema }),
    userController.create
);
router.put(
    '/:id',
    authenticate,
    validate({ params: idParamSchema, body: updateUserSchema }),
    checkSelfOrAdmin,
    userController.update
);
router.patch(
    '/:id/rights',
    authenticate,
    requireRights(UserRight.EDIT_RIGHTS),
    validate({ params: idParamSchema, body: updateRightsSchema }),
    userController.updateRights
);
router.delete(
    '/:id',
    authenticate,
    requireRights(UserRight.EDIT_RIGHTS),
    validate({ params: idParamSchema }),
    userController.deleteUser
);

export default router;
