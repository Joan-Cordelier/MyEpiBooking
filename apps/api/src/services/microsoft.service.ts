/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Microsoft Authentication Service
*/

import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { UserRight } from '@prisma/client';
import { generateToken } from '../utils/jwt';

interface MicrosoftUserInfo {
    sub: string;
    email: string;
    name?: string;
    given_name?: string;
    family_name?: string;
}

async function fetchMicrosoftUserInfo(accessToken: string) {
    const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!userInfoResponse.ok)
        throw new AppError(401, 'Failed to fetch user information from Microsoft');
    return await userInfoResponse.json();
}

function extractUserData(microsoftUser: any) {
    const email = microsoftUser.mail || microsoftUser.userPrincipalName;
    if (!email)
        throw new AppError(400, 'Email not available from Microsoft account');

    return { email, firstName: microsoftUser.givenName, name: microsoftUser.surname };
}

async function findOrCreateUser(email: string, firstName: string, name: string) {
    const userInclude = {
        campus: true,
        rights: {
            select: {
                right: true,
            }
        }
    };
    let user = await prisma.user.findUnique({
        where: { email },
        include: userInclude,
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                name,
                firstName,
                password: '',
                rights: {
                    create: {
                        right: UserRight.BOOK_ROOM
                    }
                }
            },
            include: userInclude,
        });
    }
    return user;
}

function formatUserResponse(user: any) {
    const token = generateToken(user.id, user.email);
    const { password: _, ...userWithoutPassword } = user;
    const userData = {
        ...userWithoutPassword,
        rights: user.rights.map((r: { right: UserRight }) => r.right),
    };

    return { user: userData, token };
}

export async function authenticateWithMicrosoft(accessToken: string, idToken?: string) {
    try {
        const microsoftUser = await fetchMicrosoftUserInfo(accessToken);
        const { email, firstName, name } = extractUserData(microsoftUser);
        const user = await findOrCreateUser(email, firstName, name);
        return formatUserResponse(user);
    } catch (error) {
        throw error;
    }
}
