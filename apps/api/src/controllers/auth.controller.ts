import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import * as microsoftAuthService from '../services/microsoft.service'
import { asyncHandler, AppError } from '../middleware/error.middleware';
import { env } from '../config/env';

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
    if (!req.user)
        throw new AppError(401, 'User not authenticated');

    const user = await authService.getMe(req.user.id);
    res.status(200).json(user);
});

export const microsoftOAuthHandler = asyncHandler(async (req: Request, res: Response) => {
    const { access_token, id_token } = req.body;
    if (!access_token)
        throw new AppError(400, 'Access token is required');
    const result = await microsoftAuthService.authenticateWithMicrosoftToken(access_token, id_token);

    res.status(200).json(result);
});

export const microsoftOAuthCallback = asyncHandler(async (req: Request, res: Response) => {
    const { code, state, error, error_description } = req.query;
    const errorMessage = error_description || error;

    if (error)
        return res.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent(String(errorMessage))}`);
    if (!code)
        return res.redirect(`${env.FRONTEND_URL}/login?error=No+authorization+code+received`);

    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/microsoft/callback`;
    const result = await microsoftAuthService.authenticateWithMicrosoftCode(String(code), redirectUri);
    const token = encodeURIComponent(result.token);
    const user = encodeURIComponent(JSON.stringify(result.user));

    res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}&user=${user}`);
});
