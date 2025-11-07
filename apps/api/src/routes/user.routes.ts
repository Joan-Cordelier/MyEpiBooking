import { Router } from 'express';
import { z } from 'zod';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRights } from '../middleware/rights.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRight } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';

const router = Router();

// Zod schemas
const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
    firstName: z.string().optional(),
    actual_promotion: z.string().optional(),
    photo: z.string().url().optional(),
    campusId: z.string().cuid().optional(),
    rights: z.array(z.nativeEnum(UserRight)).optional(),
});

const updateUserSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    name: z.string().optional(),
    firstName: z.string().optional(),
    actual_promotion: z.string().optional(),
    photo: z.string().url().optional(),
    campusId: z.string().cuid().optional().nullable(),
});

const updateRightsSchema = z.object({
    rights: z.array(z.nativeEnum(UserRight)),
});

const idParamSchema = z.object({
    id: z.string().cuid(),
});

// Middleware to check if user is accessing their own profile or is SUPER_ADMIN
const checkSelfOrAdmin = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        if (!req.user) {
            throw new AppError(401, 'Authentication required');
        }
        const requestedUserId = req.params.id;
        const currentUserId = req.user.id;
        const userRights = req.user.rights || [];

        if (userRights.includes(UserRight.EDIT_RIGHTS)) {
            return next();
        }
        if (requestedUserId === currentUserId) {
            return next();
        }
        throw new AppError(403, 'You can only access your own profile');
    } catch (error) {
        next(error);
    }
};

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
