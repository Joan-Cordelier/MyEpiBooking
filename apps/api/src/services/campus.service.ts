import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';


export interface CampusFilters {
    city?: string;
    name?: string;
}

export async function getAll(filters?: CampusFilters) {
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
}

export async function getById(id: string) {
    const campus = await prisma.campus.findUnique({
        where: { id },
    });

    if (!campus) {
        throw new AppError(404, 'Campus not found');
    }

    return campus;
}

export async function create(
    name: string,
    city: string,
    address?: string | null
) {
    const campusExist = await prisma.campus.findUnique({
        where: { name },
    });

    if (campusExist) {
        throw new AppError(409, 'Campus with this name already exists');
    }

    const campus = await prisma.campus.create({
        data: {
            name,
            city,
            address: address ?? null,
        }
    });

    return campus;
}

export async function update(id: string, updateFields: Prisma.CampusUpdateInput) {
    const campus = await prisma.campus.update({
        where: { id },
        data: updateFields,
    });

    return campus;
}

export async function deleteCampus(id: string) {
    const campus = await prisma.campus.delete({
        where: { id },
    });

    return campus;
}
