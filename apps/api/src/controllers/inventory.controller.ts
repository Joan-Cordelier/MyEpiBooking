import { Request, Response } from 'express';
import * as inventoryService from '../services/inventory.service';
import { asyncHandler } from '../middleware/error.middleware';

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const inventories = await inventoryService.getAll();

    res.status(200).json(inventories);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const inventory = await inventoryService.getById(id);

    res.status(200).json(inventory);
});

export const getByRoomId = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;

    const inventory = await inventoryService.getByRoomId(roomId);

    res.status(200).json(inventory);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const { tables, chairs, hasBoard, hasTV, roomId, notes } = req.body;

    const inventory = await inventoryService.create(tables, chairs, hasBoard, hasTV, roomId, notes);

    res.status(201).json(inventory);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateFields = req.body;

    const inventory = await inventoryService.update(id, updateFields);

    res.status(200).json(inventory);
});

export const deleteInventory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await inventoryService.deleteInventory(id);

    res.status(200).json(result);
});
