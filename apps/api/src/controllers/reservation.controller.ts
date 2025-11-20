import { Request, Response } from 'express';
import * as reservationService from '../services/reservation.service';
import { asyncHandler } from '../middleware/error.middleware';

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
        userId: req.query.userId as string | undefined,
        roomId: req.query.roomId as string | undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        type: req.query.type as string | undefined,
    };

    const result = await reservationService.getAll(filters);
    res.status(200).json(result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const reservation = await reservationService.getById(req.params.id);
    res.status(200).json(reservation);
});

export const getMyReservations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const reservations = await reservationService.getByUserId(userId);
    res.status(200).json(reservations);
});

export const getRoomReservations = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;
    let dateRange;

    if (req.query.startDate && req.query.endDate) {
        dateRange = {
            startDate: new Date(req.query.startDate as string),
            endDate: new Date(req.query.endDate as string),
        };
    }

    const reservations = await reservationService.getByRoomId(roomId, dateRange);
    res.status(200).json(reservations);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const reservation = await reservationService.create({
        ...req.body,
        userId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
    });

    res.status(201).json(reservation);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const updateData = {
        ...req.body,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
    };

    const reservation = await reservationService.update(req.params.id, updateData);
    res.status(200).json(reservation);
});

export const deleteReservation = asyncHandler(async (req: Request, res: Response) => {
    const result = await reservationService.deleteReservation(req.params.id);
    res.status(200).json(result);
});
