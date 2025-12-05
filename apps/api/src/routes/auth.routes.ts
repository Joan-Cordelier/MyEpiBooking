import { Router } from 'express';
import { z } from 'zod';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().optional(),
    firstName: z.string().optional(),
    campusId: z.string().cuid().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
});

router.post(
    '/register',
    validate({ body: registerSchema }),
    authController.register
);
router.post(
    '/login',
    validate({ body: loginSchema }),
    authController.login
);
router.get(
    '/me',
    authenticate,
    authController.me
);
router.post(
    '/microsoft',
    authController.microsoftOAuthHandler
);

export default router;
