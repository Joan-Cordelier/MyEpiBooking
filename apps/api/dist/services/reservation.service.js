"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.getByUserId = getByUserId;
exports.getByRoomId = getByRoomId;
exports.create = create;
exports.update = update;
exports.deleteReservation = deleteReservation;
const database_1 = require("../config/database");
const client_1 = require("@prisma/client");
async function getAll(filters) {
    try {
        const where = {};
        if (filters?.userId) {
            where.userId = filters.userId;
        }
        if (filters?.roomId) {
            where.roomId = filters.roomId;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        //TODO: Date range filtering
        const reservations = await database_1.prisma.reservation.findMany({
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
    catch (error) {
        throw error;
    }
}
async function getById(id) {
    try {
        const reservation = await database_1.prisma.reservation.findUnique({
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
    }
    catch (error) {
        throw error;
    }
}
async function getByUserId(userId) {
    try {
        const reservations = await database_1.prisma.reservation.findMany({
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
    catch (error) {
        throw error;
    }
}
async function getByRoomId(roomId, dateRange) {
    try {
        const where = { roomId };
        if (dateRange) {
            where.AND = [
                { endDate: { gte: dateRange.startDate } },
                { startDate: { lte: dateRange.endDate } }
            ];
        }
        const reservations = await database_1.prisma.reservation.findMany({
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
    catch (error) {
        throw error;
    }
}
async function create(data) {
    try {
        if (data.startDate >= data.endDate) {
            throw new Error('Start date must be before end date');
        }
        const room = await database_1.prisma.room.findUnique({
            where: { id: data.roomId }
        });
        if (!room) {
            throw new Error('Room not found');
        }
        if (room.state !== client_1.RoomState.RESERVABLE) {
            throw new Error('Room is not available for reservation');
        }
        const overlapping = await database_1.prisma.reservation.findFirst({
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
        const user = await database_1.prisma.user.findUnique({
            where: { id: data.userId }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const reservation = await database_1.prisma.reservation.create({
            data: {
                type: data.type,
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
    catch (error) {
        throw error;
    }
}
async function update(id, data) {
    try {
        const existing = await database_1.prisma.reservation.findUnique({
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
            const room = await database_1.prisma.room.findUnique({
                where: { id: roomId }
            });
            if (!room) {
                throw new Error('Room not found');
            }
            if (room.state !== client_1.RoomState.RESERVABLE) {
                throw new Error('Room is not available for reservation');
            }
            const overlapping = await database_1.prisma.reservation.findFirst({
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
        const reservation = await database_1.prisma.reservation.update({
            where: { id },
            data: {
                type: data.type,
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
    }
    catch (error) {
        throw error;
    }
}
async function deleteReservation(id) {
    try {
        const reservation = await database_1.prisma.reservation.findUnique({
            where: { id }
        });
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        await database_1.prisma.reservation.delete({
            where: { id }
        });
        return { message: 'Reservation cancelled successfully' };
    }
    catch (error) {
        throw error;
    }
}
