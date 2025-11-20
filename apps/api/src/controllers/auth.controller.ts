import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { asyncHandler, AppError } from '../middleware/error.middleware';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, firstName, campusId } = req.body;

    const result = await authService.register({
        email,
        password,
        name,
        firstName,
        campusId,
    });

    res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new AppError(401, 'User not authenticated');
    }

    const user = await authService.getMe(req.user.id);

    res.status(200).json(user);
});
