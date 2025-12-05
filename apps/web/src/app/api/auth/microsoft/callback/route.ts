/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Microsoft OAuth2 callback API route
*/

import { NextRequest, NextResponse } from 'next/server';

const MICROSOFT_TOKEN_ENDPOINT = "https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token";
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
    try {
        const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
        const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
        const tenantId = process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID || 'common';
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`;
        const tokenEndpoint = MICROSOFT_TOKEN_ENDPOINT.replace('{tenantId}', tenantId);
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json(
                { message: 'Authorization code is required' },
                { status: 400 }
            );
        }
        if (!clientId || !clientSecret) {
            console.error('Missing Microsoft OAuth credentials');
            return NextResponse.json(
                { message: 'OAuth configuration error' },
                { status: 500 }
            );
        }

        const tokenParams = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        });
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenParams.toString(),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Microsoft token exchange error:', errorData);
            return NextResponse.json(
                { message: errorData.error_description || 'Failed to exchange authorization code' },
                { status: 401 }
            );
        }

        const tokenData = await tokenResponse.json();
        const { access_token, id_token } = tokenData;
        const backendResponse = await fetch(`${BACKEND_API_URL}/api/auth/microsoft`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_token,
                id_token,
            }),
        });

        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            console.error('Backend authentication error:', errorData);
            return NextResponse.json(
                { message: errorData.message || 'Backend authentication failed' },
                { status: backendResponse.status }
            );
        }

        const userData = await backendResponse.json();

        return NextResponse.json({
            token: userData.token,
            user: userData.user,
        });

    } catch (error: any) {
        console.error('OAuth callback API error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
