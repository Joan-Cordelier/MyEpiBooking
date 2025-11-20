import { prisma } from '../config/database';
import { Prisma, RoomState } from '@prisma/client';

export interface RoomFilters {
    campusId?: string;
    floor?: string;
    state?: RoomState;
}

export async function getAll(filters?: RoomFilters) {
    try {
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
    } catch (error) {
        throw error;
    }
}

export async function getById(id: string) {
    try {
        const room = await prisma.room.findUnique({
            where: { id },
        });

        if (!room) {
            throw new Error('Room not found');
        }
        return room;
    } catch (error) {
        throw error;
    }
}

export async function create(
    name: string,
    floor: string,
    capacity: number,
    description: string,
    campusId: string,
    state?: RoomState
) {
    try {
        const campusExist = await prisma.campus.findUnique({
            where: { id: campusId },
        });

        if (!campusExist) {
            throw new Error('Campus not found');
        }

        const roomExist = await prisma.room.findFirst({
            where: {
                campusId,
                name,
            },
        });

        if (roomExist) {
            throw new Error('Room with this name already exists in this campus');
        }

        const data: any = {
            name,
            floor,
            capacity,
            description,
            campusId,
            state: state ?? RoomState.RESERVABLE,
        };
        const room = await prisma.room.create({ data });
        return room;
    } catch (error) {
        throw error;
    }
}

export async function update(id: string, updateFields: Prisma.RoomUpdateInput) {
    try {
        const room = await prisma.room.update({
            where: { id },
            data: {
                ...updateFields,
            },
        });
        return room;
    } catch (error) {
        throw error;
    }
}

export async function updateState(id: string, state: RoomState) {
    try {
        const room = await prisma.room.update({
            where: { id },
            data: { state },
        });
        return room;
    } catch (error) {
        throw error;
    }
}

export async function deleteRoom(id: string) {
    try {
        const room = await prisma.room.delete({
            where: { id },
        });
        return room;
    } catch (error) {
        throw error;
    }
}
