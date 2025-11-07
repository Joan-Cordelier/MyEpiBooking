import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { asyncHandler } from '../middleware/error.middleware';

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
    const users = await userService.getAll();
    res.status(200).json(users);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getById(req.params.id);
    res.status(200).json(user);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    res.status(201).json(user);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.update(req.params.id, req.body);
    res.status(200).json(user);
});

export const updateRights = asyncHandler(async (req: Request, res: Response) => {
    const { rights } = req.body;
    const user = await userService.updateRights(req.params.id, rights);
    res.status(200).json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.deleteUser(req.params.id);
    res.status(200).json(result);
});
