/**
 * Admin Layout
 * Handles authentication for all admin routes
 * Shows loading state during auth check, redirects to login if not authenticated,
 * and renders child routes via Slot when authenticated.
 */

import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { getSupabaseClient } from '@/src/utils/supabase';
import { Redirect, Slot, usePathname } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

export default function AdminLayout() {
    const pathname = usePathname();
    const [authState, setAuthState] = useState<AuthState>('loading');

    const checkAuth = useCallback(async () => {
        try {
            const supabase = await getSupabaseClient();
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                console.log('[AdminLayout] No session found');
                setAuthState('unauthenticated');
                return;
            }

            // Verify admin email
            if (session.user.email?.toLowerCase() !== 'alex@auschildsupport.com') {
                console.log('[AdminLayout] Not admin email - signing out');
                await supabase.auth.signOut();
                setAuthState('unauthenticated');
                return;
            }

            console.log('[AdminLayout] Authenticated as admin');
            setAuthState('authenticated');
        } catch (error) {
            console.error('[AdminLayout] Auth check error:', error);
            setAuthState('unauthenticated');
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Listen for auth state changes (e.g., after login)
    useEffect(() => {
        let subscription: { unsubscribe: () => void } | null = null;

        const setupAuthListener = async () => {
            const supabase = await getSupabaseClient();
            const { data } = supabase.auth.onAuthStateChange((event, session) => {
                console.log('[AdminLayout] Auth state change:', event);

                if (event === 'SIGNED_IN' && session) {
                    if (session.user.email?.toLowerCase() === 'alex@auschildsupport.com') {
                        setAuthState('authenticated');
                    } else {
                        setAuthState('unauthenticated');
                    }
                } else if (event === 'SIGNED_OUT') {
                    setAuthState('unauthenticated');
                }
            });

            subscription = data.subscription;
        };

        setupAuthListener();

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Always show loading indicator while checking auth
    if (authState === 'loading') {
        return <LoadingFallback />;
    }

    // Allow login page to be accessed without authentication
    const isLoginPage = pathname === '/admin/login';

    // If not authenticated and not on login page, redirect to login
    if (authState === 'unauthenticated' && !isLoginPage) {
        return <Redirect href="/admin/login" />;
    }

    // If authenticated and on login page, redirect to dashboard
    if (authState === 'authenticated' && isLoginPage) {
        return <Redirect href="/admin/dashboard" />;
    }

    // Render child routes
    return <Slot />;
}
