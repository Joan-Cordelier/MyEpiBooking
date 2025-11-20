"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.deleteCampus = deleteCampus;
const database_1 = require("../config/database");
async function getAll(filters) {
    try {
        const where = {};
        if (filters?.city) {
            where.city = {
                contains: filters.city,
            };
        }
        if (filters?.name) {
            where.name = {
                contains: filters.name,
            };
        }
        const campuses = await database_1.prisma.campus.findMany({
            where,
            orderBy: { name: 'asc' },
        });
        return campuses;
    }
    catch (error) {
        throw error;
    }
}
async function getById(id) {
    try {
        const campus = await database_1.prisma.campus.findUnique({
            where: { id },
        });
        if (!campus) {
            throw new Error('Campus not found');
        }
        return campus;
    }
    catch (error) {
        throw error;
    }
}
async function create(name, city, address) {
    try {
        const campusExist = await database_1.prisma.campus.findUnique({
            where: { name },
        });
        if (campusExist) {
            throw new Error('Campus with this name already exists');
        }
        const data = {
            name,
            city,
            address: address ?? null,
        };
        const campus = await database_1.prisma.campus.create({ data });
        return campus;
    }
    catch (error) {
        throw error;
    }
}
async function update(id, updateFields) {
    try {
        const campus = await database_1.prisma.campus.update({
            where: { id },
            data: {
                ...updateFields,
            },
        });
        return campus;
    }
    catch (error) {
        throw error;
    }
}
async function deleteCampus(id) {
    try {
        const campus = await database_1.prisma.campus.delete({
            where: { id },
        });
        return campus;
    }
    catch (error) {
        throw error;
    }
}
