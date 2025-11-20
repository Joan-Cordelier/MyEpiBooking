"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.getByRoomId = getByRoomId;
exports.create = create;
exports.update = update;
exports.deleteInventory = deleteInventory;
const database_1 = require("../config/database");
async function getAll() {
    try {
        const inventories = await database_1.prisma.inventory.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return inventories;
    }
    catch (error) {
        throw error;
    }
}
async function getById(id) {
    try {
        const inventory = await database_1.prisma.inventory.findUnique({
            where: { id },
        });
        if (!inventory) {
            throw new Error('Inventory not found');
        }
        return inventory;
    }
    catch (error) {
        throw error;
    }
}
async function getByRoomId(roomId) {
    try {
        const inventory = await database_1.prisma.inventory.findUnique({
            where: { roomId },
        });
        if (!inventory) {
            throw new Error('Inventory not found for this room');
        }
        return inventory;
    }
    catch (error) {
        throw error;
    }
}
async function create(tables, chairs, hasBoard, hasTV, roomId, notes) {
    try {
        const roomExist = await database_1.prisma.room.findUnique({
            where: { id: roomId },
        });
        if (!roomExist) {
            throw new Error('Room not found');
        }
        const inventoryExist = await database_1.prisma.inventory.findUnique({
            where: { roomId },
        });
        if (inventoryExist) {
            throw new Error('Inventory already exists for this room');
        }
        const data = {
            tables,
            chairs,
            hasBoard,
            hasTV,
            roomId,
            notes: notes ?? null,
        };
        const inventory = await database_1.prisma.inventory.create({ data });
        return inventory;
    }
    catch (error) {
        throw error;
    }
}
async function update(id, updateFields) {
    try {
        const inventory = await database_1.prisma.inventory.update({
            where: { id },
            data: {
                ...updateFields,
            },
        });
        return inventory;
    }
    catch (error) {
        throw error;
    }
}
async function deleteInventory(id) {
    try {
        const inventory = await database_1.prisma.inventory.delete({
            where: { id },
        });
        return inventory;
    }
    catch (error) {
        throw error;
    }
}
