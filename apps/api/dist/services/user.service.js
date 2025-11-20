"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.updateRights = updateRights;
exports.deleteUser = deleteUser;
const database_1 = require("../config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// User select without password
const userSelect = {
    id: true,
    email: true,
    name: true,
    firstName: true,
    actual_promotion: true,
    photo: true,
    campusId: true,
    campus: true,
    rights: {
        select: {
            right: true,
        }
    },
    createdAt: true,
    updatedAt: true,
};
async function getAll() {
    try {
        const users = await database_1.prisma.user.findMany({
            select: userSelect,
            orderBy: { createdAt: 'desc' },
        });
        return users.map(user => ({
            ...user,
            rights: user.rights.map(r => r.right),
        }));
    }
    catch (error) {
        throw error;
    }
}
async function getById(id) {
    try {
        const user = await database_1.prisma.user.findUnique({
            where: { id },
            select: userSelect,
        });
        if (!user) {
            throw new Error('User not found');
        }
        return {
            ...user,
            rights: user.rights.map(r => r.right),
        };
    }
    catch (error) {
        throw error;
    }
}
async function create(data) {
    try {
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        if (data.campusId) {
            const campus = await database_1.prisma.campus.findUnique({
                where: { id: data.campusId }
            });
            if (!campus) {
                throw new Error('Campus not found');
            }
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await database_1.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                firstName: data.firstName,
                actual_promotion: data.actual_promotion,
                photo: data.photo,
                campusId: data.campusId,
                rights: data.rights ? {
                    create: data.rights.map(right => ({
                        right
                    }))
                } : undefined,
            },
            select: userSelect,
        });
        return {
            ...user,
            rights: user.rights.map(r => r.right),
        };
    }
    catch (error) {
        throw error;
    }
}
async function update(id, data) {
    try {
        const existing = await database_1.prisma.user.findUnique({
            where: { id }
        });
        if (!existing) {
            throw new Error('User not found');
        }
        if (data.email && data.email !== existing.email) {
            const emailExists = await database_1.prisma.user.findUnique({
                where: { email: data.email }
            });
            if (emailExists) {
                throw new Error('Email already in use');
            }
        }
        if (data.campusId) {
            const campus = await database_1.prisma.campus.findUnique({
                where: { id: data.campusId }
            });
            if (!campus) {
                throw new Error('Campus not found');
            }
        }
        // Hash password if provided
        let hashedPassword;
        if (data.password) {
            hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        }
        const user = await database_1.prisma.user.update({
            where: { id },
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                firstName: data.firstName,
                actual_promotion: data.actual_promotion,
                photo: data.photo,
                campusId: data.campusId,
            },
            select: userSelect,
        });
        return {
            ...user,
            rights: user.rights.map(r => r.right),
        };
    }
    catch (error) {
        throw error;
    }
}
async function updateRights(id, rights) {
    try {
        const user = await database_1.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new Error('User not found');
        }
        await database_1.prisma.userRightAssignment.deleteMany({
            where: { userId: id }
        });
        await database_1.prisma.userRightAssignment.createMany({
            data: rights.map(right => ({
                userId: id,
                right
            }))
        });
        const updatedUser = await database_1.prisma.user.findUnique({
            where: { id },
            select: userSelect,
        });
        return {
            ...updatedUser,
            rights: updatedUser.rights.map(r => r.right),
        };
    }
    catch (error) {
        throw error;
    }
}
async function deleteUser(id) {
    try {
        const user = await database_1.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new Error('User not found');
        }
        await database_1.prisma.user.delete({
            where: { id }
        });
        return { message: 'User deleted successfully' };
    }
    catch (error) {
        throw error;
    }
}
