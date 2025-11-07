import { prisma } from '../config/database';
import { Prisma, RoomState } from '@prisma/client';

export async function getAll(filters?: {
    userId?: string;
    roomId?: string;
    startDate?: Date;
    endDate?: Date;
    type?: string;
}) {
    try {
        const where: Prisma.ReservationWhereInput = {};

        if (filters?.userId) {
            where.userId = filters.userId;
        }
        if (filters?.roomId) {
            where.roomId = filters.roomId;
        }
        if (filters?.type) {
            where.type = filters.type as any;
        }
        //TODO: Date range filtering
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
    } catch (error) {
        throw error;
    }
}

export async function getById(id: string) {
    try {
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
            throw new Error('Reservation not found');
        }
        return reservation;
    } catch (error) {
        throw error;
    }
}

export async function getByUserId(userId: string) {
    try {
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
    } catch (error) {
        throw error;
    }
}

export async function getByRoomId(roomId: string, dateRange?: { startDate: Date; endDate: Date }) {
    try {
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
    } catch (error) {
        throw error;
    }
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
    try {
        if (data.startDate >= data.endDate) {
            throw new Error('Start date must be before end date');
        }
        const room = await prisma.room.findUnique({
            where: { id: data.roomId }
        });
        if (!room) {
            throw new Error('Room not found');
        }
        if (room.state !== RoomState.RESERVABLE) {
            throw new Error('Room is not available for reservation');
        }

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
            throw new Error('Room is already reserved for this time period');
        }

        const user = await prisma.user.findUnique({
            where: { id: data.userId }
        });
        if (!user) {
            throw new Error('User not found');
        }

        const reservation = await prisma.reservation.create({
            data: {
                type: data.type as any,
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
    } catch (error) {
        throw error;
    }
}

export async function update(id: string, data: {
    type?: string;
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    roomId?: string;
}) {
    try {
        const existing = await prisma.reservation.findUnique({
            where: { id }
        });
        if (!existing) {
            throw new Error('Reservation not found');
        }

        const startDate = data.startDate || existing.startDate;
        const endDate = data.endDate || existing.endDate;
        if (startDate >= endDate) {
            throw new Error('Start date must be before end date');
        }

        const roomId = data.roomId || existing.roomId;
        if (data.roomId || data.startDate || data.endDate) {
            const room = await prisma.room.findUnique({
                where: { id: roomId }
            });
            if (!room) {
                throw new Error('Room not found');
            }
            if (room.state !== RoomState.RESERVABLE) {
                throw new Error('Room is not available for reservation');
            }
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
                throw new Error('Room is already reserved for this time period');
            }
        }

        const reservation = await prisma.reservation.update({
            where: { id },
            data: {
                type: data.type as any,
                title: data.title,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
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
    } catch (error) {
        throw error;
    }
}

export async function deleteReservation(id: string) {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id }
        });
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        await prisma.reservation.delete({
            where: { id }
        });
        return { message: 'Reservation cancelled successfully' };
    } catch (error) {
        throw error;
    }
}
