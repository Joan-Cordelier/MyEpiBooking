"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.updateState = updateState;
exports.deleteRoom = deleteRoom;
const database_1 = require("../config/database");
const client_1 = require("@prisma/client");
async function getAll(filters) {
    try {
        const where = {};
        if (filters?.campusId) {
            where.campusId = filters.campusId;
        }
        if (filters?.floor) {
            where.floor = filters.floor;
        }
        if (filters?.state) {
            where.state = filters.state;
        }
        const rooms = await database_1.prisma.room.findMany({
            where,
            orderBy: { name: 'asc' },
        });
        return rooms;
    }
    catch (error) {
        throw error;
    }
}
async function getById(id) {
    try {
        const room = await database_1.prisma.room.findUnique({
            where: { id },
        });
        if (!room) {
            throw new Error('Room not found');
        }
        return room;
    }
    catch (error) {
        throw error;
    }
}
async function create(name, floor, capacity, description, campusId, state) {
    try {
        const campusExist = await database_1.prisma.campus.findUnique({
            where: { id: campusId },
        });
        if (!campusExist) {
            throw new Error('Campus not found');
        }
        const roomExist = await database_1.prisma.room.findFirst({
            where: {
                campusId,
                name,
            },
        });
        if (roomExist) {
            throw new Error('Room with this name already exists in this campus');
        }
        const data = {
            name,
            floor,
            capacity,
            description,
            campusId,
            state: state ?? client_1.RoomState.RESERVABLE,
        };
        const room = await database_1.prisma.room.create({ data });
        return room;
    }
    catch (error) {
        throw error;
    }
}
async function update(id, updateFields) {
    try {
        const room = await database_1.prisma.room.update({
            where: { id },
            data: {
                ...updateFields,
            },
        });
        return room;
    }
    catch (error) {
        throw error;
    }
}
async function updateState(id, state) {
    try {
        const room = await database_1.prisma.room.update({
            where: { id },
            data: { state },
        });
        return room;
    }
    catch (error) {
        throw error;
    }
}
async function deleteRoom(id) {
    try {
        const room = await database_1.prisma.room.delete({
            where: { id },
        });
        return room;
    }
    catch (error) {
        throw error;
    }
}
