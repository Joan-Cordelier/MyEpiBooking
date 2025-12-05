/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Microsoft OAuth2 configuration and utilities
*/

const TENANT_ID = process.env.NEXT_PUBLIC_MICROSOFT_TENANT_ID || 'common';

export const MICROSOFT_OAUTH_CONFIG = {
    get tenantId() {
        return TENANT_ID;
    },
    get authorityUrl() {
        return `https://login.microsoftonline.com/${TENANT_ID}`;
    },
    get authorizeEndpoint() {
        return `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`;
    },
    get tokenEndpoint() {
        return `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    },
    graphEndpoint: 'https://graph.microsoft.com',
    scopes: ['openid', 'profile', 'email', 'User.Read'],
};

export function getMicrosoftAuthUrl(clientId: string, redirectUri: string, state?: string): string {
    const params = new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: MICROSOFT_OAUTH_CONFIG.scopes.join(' '),
        response_mode: 'query',
        ...(state && { state }),
    });

    return `${MICROSOFT_OAUTH_CONFIG.authorizeEndpoint}?${params.toString()}`;
}

export function getRedirectUri(): string {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return `${backendUrl}/api/auth/microsoft/callback`;
}

export function generateState(): string {
    const array = new Uint8Array(32);

    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function initiateOAuthLogin(): void {
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    const from = window.location.pathname;
    const redirectUri = getRedirectUri();
    const state = generateState();

    if (!clientId) {
        console.error('Microsoft Client ID is not configured');
        return;
    }
    console.log('OAuth Configuration:', {
        clientId,
        redirectUri,
        state,
    });
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('oauth_state', state);
        sessionStorage.setItem('oauth_from', from);
    }

    const authUrl = getMicrosoftAuthUrl(clientId, redirectUri, state);

    window.location.href = authUrl;
}
