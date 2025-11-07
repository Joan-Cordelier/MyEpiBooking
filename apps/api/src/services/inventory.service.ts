import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

export async function getAll() {
    try {
        const inventories = await prisma.inventory.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return inventories;
    } catch (error) {
        throw error;
    }
}

export async function getById(id: string) {
    try {
        const inventory = await prisma.inventory.findUnique({
            where: { id },
        });

        if (!inventory) {
            throw new Error('Inventory not found');
        }
        return inventory;
    } catch (error) {
        throw error;
    }
}

export async function getByRoomId(roomId: string) {
    try {
        const inventory = await prisma.inventory.findUnique({
            where: { roomId },
        });

        if (!inventory) {
            throw new Error('Inventory not found for this room');
        }
        return inventory;
    } catch (error) {
        throw error;
    }
}

export async function create(
    tables: number,
    chairs: number,
    hasBoard: boolean,
    hasTV: boolean,
    roomId: string,
    notes?: string | null
) {
    try {
        const roomExist = await prisma.room.findUnique({
            where: { id: roomId },
        });

        if (!roomExist) {
            throw new Error('Room not found');
        }

        const inventoryExist = await prisma.inventory.findUnique({
            where: { roomId },
        });

        if (inventoryExist) {
            throw new Error('Inventory already exists for this room');
        }

        const data: any = {
            tables,
            chairs,
            hasBoard,
            hasTV,
            roomId,
            notes: notes ?? null,
        };

        const inventory = await prisma.inventory.create({ data });
        return inventory;
    } catch (error) {
        throw error;
    }
}

export async function update(id: string, updateFields: Prisma.InventoryUpdateInput) {
    try {
        const inventory = await prisma.inventory.update({
            where: { id },
            data: {
                ...updateFields,
            },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}

export async function deleteInventory(id: string) {
    try {
        const inventory = await prisma.inventory.delete({
            where: { id },
        });
        return inventory;
    } catch (error) {
        throw error;
    }
}
