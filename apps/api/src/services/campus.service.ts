import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';


export interface CampusFilters {
    city?: string;
    name?: string;
}

export async function getAll(filters?: CampusFilters) {
    try {
        const where: Prisma.CampusWhereInput = {};

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

        const campuses = await prisma.campus.findMany({
            where,
            orderBy: { name: 'asc' },
        });

        return campuses;
    } catch (error) {
        throw error;
    }
}

export async function getById(id: string) {
    try {
        const campus = await prisma.campus.findUnique({
            where: { id },
        });

        if (!campus) {
            throw new Error('Campus not found');
        }

        return campus;
    } catch (error) {
        throw error;
    }
}

export async function create(
    name: string,
    city: string,
    address?: string | null
) {
    try {
        const campusExist = await prisma.campus.findUnique({
            where: { name },
        });

        if (campusExist) {
            throw new Error('Campus with this name already exists');
        }

        const data: any = {
            name,
            city,
            address: address ?? null,
        };

        const campus = await prisma.campus.create({ data });

        return campus;
    } catch (error) {
        throw error;
    }
}

export async function update(id: string, updateFields: Prisma.CampusUpdateInput) {
    try {
        const campus = await prisma.campus.update({
            where: { id },
            data: {
                ...updateFields,
            },
        });

        return campus;
    } catch (error) {
        throw error;
    }
}

export async function deleteCampus(id: string) {
    try {
        const campus = await prisma.campus.delete({
            where: { id },
        });

        return campus;
    } catch (error) {
        throw error;
    }
}
