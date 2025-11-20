"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.getMe = getMe;
const database_1 = require("../config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
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
async function register(data) {
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
        const hashedPassword = await hashPassword(data.password);
        const user = await database_1.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                firstName: data.firstName,
                campusId: data.campusId,
                rights: {
                    create: {
                        right: client_1.UserRight.BOOK_ROOM
                    }
                }
            },
            select: userSelect,
        });
        const token = (0, jwt_1.generateToken)(user.id, user.email);
        const userData = {
            ...user,
            rights: user.rights.map(r => r.right),
        };
        return {
            user: userData,
            token
        };
    }
    catch (error) {
        throw error;
    }
}
async function login(email, password) {
    try {
        const user = await database_1.prisma.user.findUnique({
            where: { email },
            include: {
                campus: true,
                rights: {
                    select: {
                        right: true,
                    }
                }
            }
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        const token = (0, jwt_1.generateToken)(user.id, user.email);
        const { password: _, ...userWithoutPassword } = user;
        const userData = {
            ...userWithoutPassword,
            rights: user.rights.map(r => r.right),
        };
        return {
            user: userData,
            token
        };
    }
    catch (error) {
        throw error;
    }
}
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 10);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
async function getMe(userId) {
    try {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
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
