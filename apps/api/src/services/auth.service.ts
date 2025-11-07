import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { UserRight } from '@prisma/client';

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

export async function register(data: {
    email: string;
    password: string;
    name?: string;
    firstName?: string;
    campusId?: string;
}) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        if (data.campusId) {
            const campus = await prisma.campus.findUnique({
                where: { id: data.campusId }
            });

            if (!campus) {
                throw new Error('Campus not found');
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                firstName: data.firstName,
                campusId: data.campusId,
                rights: {
                    create: {
                        right: UserRight.BOOK_ROOM
                    }
                }
            },
            select: userSelect,
        });

        const token = generateToken(user.id, user.email);
        const userData = {
            ...user,
            rights: user.rights.map(r => r.right),
        };
        return {
            user: userData,
            token
        };
    } catch (error) {
        throw error;
    }
}

export async function login(email: string, password: string) {
    try {
        const user = await prisma.user.findUnique({
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
        const token = generateToken(user.id, user.email);
        const { password: _, ...userWithoutPassword } = user;
        const userData = {
            ...userWithoutPassword,
            rights: user.rights.map(r => r.right),
        };
        return {
            user: userData,
            token
        };
    } catch (error) {
        throw error;
    }
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function getMe(userId: string) {
    try {
        const user = await prisma.user.findUnique({
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
    } catch (error) {
        throw error;
    }
}
