/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** OAuth2 callback page
*/

"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from "../../page.module.css";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = searchParams?.get('token');
                const userParam = searchParams?.get('user');
                const errorParam = searchParams?.get('error');

                if (errorParam)
                    throw new Error(decodeURIComponent(errorParam));
                if (!token || !userParam)
                    throw new Error('Authentication data not received');

                localStorage.setItem('token', token);
                const user = JSON.parse(decodeURIComponent(userParam));
                localStorage.setItem('user', JSON.stringify(user));

                sessionStorage.removeItem('oauth_state');
                sessionStorage.removeItem('oauth_from');
                router.push('/');
            } catch (err: any) {
                console.error('OAuth callback error:', err);
                setError(err.message || 'Authentication failed');                
                sessionStorage.removeItem('oauth_state');
                sessionStorage.removeItem('oauth_from');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
        };
        handleCallback();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.canvas}>
                    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md">
                            <div className="flex items-start gap-3">
                                <i className="fi fi-br-cross-circle text-red-600 text-2xl mt-1"></i>
                                <div>
                                    <h3 className="text-lg font-bold text-red-900 mb-2">
                                        Erreur d'authentification
                                    </h3>
                                    <p className="text-sm text-red-700">{error}</p>
                                    <p className="text-xs text-red-600 mt-3">
                                        Redirection vers la page de connexion...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.canvas}>
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Connexion en cours...
                        </h2>
                        <p className="text-gray-600">
                            Veuillez patienter pendant que nous finalisons votre authentification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
