import { prisma } from '../config/database';
import { Prisma, RoomState, ReservationType } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export async function getAll(filters?: {
    userId?: string;
    roomId?: string;
    startDate?: Date;
    endDate?: Date;
    type?: string;
}) {
    const where: Prisma.ReservationWhereInput = {};

    if (filters?.userId) {
        where.userId = filters.userId;
    }
    if (filters?.roomId) {
        where.roomId = filters.roomId;
    }
    if (filters?.type) {
        where.type = filters.type as ReservationType;
    }

    // Date range filtering
    if (filters?.startDate || filters?.endDate) {
        where.AND = [];
        if (filters.startDate) {
            where.AND.push({ endDate: { gte: filters.startDate } });
        }
        if (filters.endDate) {
            where.AND.push({ startDate: { lte: filters.endDate } });
        }
    }

    const reservations = await prisma.reservation.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    }
                },
                room: {
                    include: {
                        campus: true
                    }
                }
            },
            orderBy: { startDate: 'asc' },
        });
    return reservations;
}

export async function getById(id: string) {
    const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                }
            },
            room: {
                include: {
                    campus: true
                }
            }
        },
    });

    if (!reservation) {
        throw new AppError(404, 'Reservation not found');
    }

    return reservation;
}

export async function getByUserId(userId: string) {
    const reservations = await prisma.reservation.findMany({
        where: { userId },
        include: {
            room: {
                include: {
                    campus: true
                }
            }
        },
        orderBy: { startDate: 'desc' },
    });

    return reservations;
}

export async function getByRoomId(roomId: string, dateRange?: { startDate: Date; endDate: Date }) {
    const where: Prisma.ReservationWhereInput = { roomId };

    if (dateRange) {
        where.AND = [
            { endDate: { gte: dateRange.startDate } },
            { startDate: { lte: dateRange.endDate } }
        ];
    }

    const reservations = await prisma.reservation.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                }
            }
        },
        orderBy: { startDate: 'asc' },
    });

    return reservations;
}

export async function create(data: {
    type: string;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    userId: string;
    roomId: string;
}) {
    // Validate room exists and is reservable
    const room = await prisma.room.findUnique({
        where: { id: data.roomId }
    });

    if (!room) {
        throw new AppError(404, 'Room not found');
    }
    if (room.state !== RoomState.RESERVABLE) {
        throw new AppError(400, 'Room is not available for reservation');
    }

    // Check for overlapping reservations
    const overlapping = await prisma.reservation.findFirst({
        where: {
            roomId: data.roomId,
            AND: [
                { startDate: { lt: data.endDate } },
                { endDate: { gt: data.startDate } }
            ]
        }
    });

    if (overlapping) {
        throw new AppError(409, 'Room is already reserved for this time period');
    }

    const reservation = await prisma.reservation.create({
        data: {
            type: data.type as ReservationType,
            title: data.title,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            userId: data.userId,
            roomId: data.roomId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                }
            },
            room: {
                include: {
                    campus: true
                }
            }
        },
    });

    return reservation;
}

export async function update(
    id: string,
    updateFields: {
        type?: string;
        title?: string;
        description?: string;
        startDate?: Date;
        endDate?: Date;
        roomId?: string;
    }
) {
    const existing = await prisma.reservation.findUnique({
        where: { id }
    });

    if (!existing) {
        throw new AppError(404, 'Reservation not found');
    }

    const startDate = (updateFields.startDate as Date) || existing.startDate;
    const endDate = (updateFields.endDate as Date) || existing.endDate;
    const roomId = updateFields.roomId || existing.roomId;
    
    // If room or dates are being changed, validate
    if (updateFields.roomId || updateFields.startDate || updateFields.endDate) {
        const room = await prisma.room.findUnique({
            where: { id: roomId }
        });
        if (!room) {
            throw new AppError(404, 'Room not found');
        }
        if (room.state !== RoomState.RESERVABLE) {
            throw new AppError(400, 'Room is not available for reservation');
        }

        // Check for overlapping reservations (excluding current reservation)
        const overlapping = await prisma.reservation.findFirst({
            where: {
                roomId,
                id: { not: id },
                AND: [
                    { startDate: { lt: endDate } },
                    { endDate: { gt: startDate } }
                ]
            }
        });

        if (overlapping) {
            throw new AppError(409, 'Room is already reserved for this time period');
        }
    }

    const reservation = await prisma.reservation.update({
        where: { id },
        data: {
            ...(updateFields.type && { type: updateFields.type as ReservationType }),
            ...(updateFields.title && { title: updateFields.title }),
            ...(updateFields.description !== undefined && { description: updateFields.description }),
            ...(updateFields.startDate && { startDate: updateFields.startDate }),
            ...(updateFields.endDate && { endDate: updateFields.endDate }),
            ...(updateFields.roomId && { roomId: updateFields.roomId }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                }
            },
            room: {
                include: {
                    campus: true
                }
            }
        },
    });

    return reservation;
}

export async function deleteReservation(id: string) {
    const reservation = await prisma.reservation.findUnique({
        where: { id }
    });

    if (!reservation) {
        throw new AppError(404, 'Reservation not found');
    }

    await prisma.reservation.delete({
        where: { id }
    });

    return { message: 'Reservation cancelled successfully' };
}
