
import { Request, Response, NextFunction } from 'express';
import * as campusService from '../services/campus.service';
import { asyncHandler } from '../middleware/error.middleware';


export const getAll = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { city, name } = req.query;
    const filters = {
        ...(city && { city: city as string }),
        ...(name && { name: name as string }),
    };
    const campuses = await campusService.getAll(filters);

    res.status(200).json(campuses);
});

export const getById = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const campus = await campusService.getById(id);

    res.status(200).json(campus);
});

export const create = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { name, city, address } = req.body;
    const campus = await campusService.create(name, city, address);

    res.status(201).json(campus);
});

export const update = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const updateFields = req.body;

    const campus = await campusService.update(id, updateFields);

    res.status(200).json(campus);
});

export const deleteCampus = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const result = await campusService.deleteCampus(id);

    res.status(200).json(result);
});
