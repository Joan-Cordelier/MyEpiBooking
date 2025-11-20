import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export async function getAll() {
    const inventories = await prisma.inventory.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return inventories;
}

export async function getById(id: string) {
    const inventory = await prisma.inventory.findUnique({
        where: { id },
    });

    if (!inventory) {
        throw new AppError(404, 'Inventory not found');
    }

    return inventory;
}

export async function getByRoomId(roomId: string) {
    const inventory = await prisma.inventory.findUnique({
        where: { roomId },
    });

    if (!inventory) {
        throw new AppError(404, 'Inventory not found for this room');
    }

    return inventory;
}

export async function create(
    tables: number,
    chairs: number,
    hasBoard: boolean,
    hasTV: boolean,
    roomId: string,
    notes?: string | null
) {
    const roomExist = await prisma.room.findUnique({
        where: { id: roomId },
    });

    if (!roomExist) {
        throw new AppError(404, 'Room not found');
    }

    const inventoryExist = await prisma.inventory.findUnique({
        where: { roomId },
    });

    if (inventoryExist) {
        throw new AppError(409, 'Inventory already exists for this room');
    }

    const inventory = await prisma.inventory.create({
        data: {
            tables,
            chairs,
            hasBoard,
            hasTV,
            roomId,
            notes: notes ?? null,
        }
    });

    return inventory;
}

export async function update(id: string, updateFields: Prisma.InventoryUpdateInput) {
    const inventory = await prisma.inventory.update({
        where: { id },
        data: updateFields,
    });

    return inventory;
}

export async function deleteInventory(id: string) {
    const inventory = await prisma.inventory.delete({
        where: { id },
    });

    return inventory;
}
