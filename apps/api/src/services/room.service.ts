import { prisma } from '../config/database';
import { Prisma, RoomState } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export interface RoomFilters {
    campusId?: string;
    floor?: string;
    state?: RoomState;
}

export async function getAll(filters?: RoomFilters) {
    const where: Prisma.RoomWhereInput = {};

    if (filters?.campusId) {
        where.campusId = filters.campusId;
    }
    if (filters?.floor) {
        where.floor = filters.floor;
    }
    if (filters?.state) {
        where.state = filters.state;
    }

    const rooms = await prisma.room.findMany({
        where,
        orderBy: { name: 'asc' },
    });

    return rooms;
}

export async function getById(id: string) {
    const room = await prisma.room.findUnique({
        where: { id },
    });

    if (!room) {
        throw new AppError(404, 'Room not found');
    }

    return room;
}

export async function create(
    name: string,
    floor: string,
    capacity: number,
    description: string,
    campusId: string,
    state?: RoomState
) {
    const campusExist = await prisma.campus.findUnique({
        where: { id: campusId },
    });

    if (!campusExist) {
        throw new AppError(404, 'Campus not found');
    }

    const roomExist = await prisma.room.findFirst({
        where: {
            campusId,
            name,
        },
    });

    if (roomExist) {
        throw new AppError(409, 'Room with this name already exists in this campus');
    }

    const room = await prisma.room.create({
        data: {
            name,
            floor,
            capacity,
            description,
            campusId,
            state: state ?? RoomState.RESERVABLE,
        }
    });

    return room;
}

export async function update(id: string, updateFields: Prisma.RoomUpdateInput) {
    const room = await prisma.room.update({
        where: { id },
        data: updateFields,
    });

    return room;
}

export async function updateState(id: string, state: RoomState) {
    const room = await prisma.room.update({
        where: { id },
        data: { state },
    });

    return room;
}

export async function deleteRoom(id: string) {
    const room = await prisma.room.delete({
        where: { id },
    });

    return room;
}
