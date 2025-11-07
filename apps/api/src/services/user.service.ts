import { prisma } from '../config/database';
import { UserRight } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

export async function getAll() {
    try {
        const users = await prisma.user.findMany({
            select: userSelect,
            orderBy: { createdAt: 'desc' },
        });

        return users.map(user => ({
            ...user,
            rights: user.rights.map(r => r.right),
        }));
    } catch (error) {
        throw error;
    }
}

export async function getById(id: string) {
    try {
        const user = await prisma.user.findUnique({
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
    } catch (error) {
        throw error;
    }
}

export async function create(data: {
    email: string;
    password: string;
    name?: string;
    firstName?: string;
    actual_promotion?: string;
    photo?: string;
    campusId?: string;
    rights?: UserRight[];
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
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
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
    } catch (error) {
        throw error;
    }
}

export async function update(id: string, data: {
    email?: string;
    name?: string;
    firstName?: string;
    actual_promotion?: string;
    photo?: string;
    campusId?: string;
    password?: string;
}) {
    try {
        const existing = await prisma.user.findUnique({
            where: { id }
        });
        if (!existing) {
            throw new Error('User not found');
        }
        if (data.email && data.email !== existing.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email: data.email }
            });
            if (emailExists) {
                throw new Error('Email already in use');
            }
        }
        if (data.campusId) {
            const campus = await prisma.campus.findUnique({
                where: { id: data.campusId }
            });
            if (!campus) {
                throw new Error('Campus not found');
            }
        }

        // Hash password if provided
        let hashedPassword: string | undefined;
        if (data.password) {
            hashedPassword = await bcrypt.hash(data.password, 10);
        }
        const user = await prisma.user.update({
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
    } catch (error) {
        throw error;
    }
}

export async function updateRights(id: string, rights: UserRight[]) {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new Error('User not found');
        }

        await prisma.userRightAssignment.deleteMany({
            where: { userId: id }
        });
        await prisma.userRightAssignment.createMany({
            data: rights.map(right => ({
                userId: id,
                right
            }))
        });

        const updatedUser = await prisma.user.findUnique({
            where: { id },
            select: userSelect,
        });

        return {
            ...updatedUser,
            rights: updatedUser!.rights.map(r => r.right),
        };
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new Error('User not found');
        }
        await prisma.user.delete({
            where: { id }
        });
        return { message: 'User deleted successfully' };
    } catch (error) {
        throw error;
    }
}
