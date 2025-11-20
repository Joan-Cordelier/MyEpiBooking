import { Request, Response } from 'express';
import * as roomService from '../services/room.service';
import { asyncHandler } from '../middleware/error.middleware';
import { RoomState } from '@prisma/client';

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const { campusId, floor, state } = req.query;

    const filters = {
        ...(campusId && { campusId: campusId as string }),
        ...(floor && { floor: floor as string }),
        ...(state && { state: state as RoomState }),
    };

    const rooms = await roomService.getAll(filters);

    res.status(200).json(rooms);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const room = await roomService.getById(id);

    res.status(200).json(room);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const { name, floor, capacity, description, campusId, state } = req.body;

    const room = await roomService.create(name, floor, capacity, description, campusId, state);

    res.status(201).json(room);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateFields = req.body;

    const room = await roomService.update(id, updateFields);

    res.status(200).json(room);
});

export const updateState = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { state } = req.body;

    const room = await roomService.updateState(id, state);

    res.status(200).json(room);
});

export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await roomService.deleteRoom(id);

    res.status(200).json(result);
});
