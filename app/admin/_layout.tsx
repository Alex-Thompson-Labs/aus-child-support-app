/**
 * Admin Layout
 * Handles authentication for all admin routes
 * Shows loading state during auth check, redirects to login if not authenticated,
 * and renders child routes via Slot when authenticated.
 */

import { LoadingFallback } from '@/src/components/ui/LoadingFallback';
import { Env } from '@/src/config/env';
import { getSupabaseClient } from '@/src/utils/supabase';
import { Redirect, Slot, usePathname } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * Check if user has admin role in app_metadata
 * app_metadata can only be set server-side, making this secure
 */
function hasAdminRole(appMetadata: Record<string, unknown> | undefined): boolean {
    return appMetadata?.role === 'admin';
}

export default function AdminLayout() {
    const pathname = usePathname();
    const [authState, setAuthState] = useState<AuthState>('loading');

    const checkAuth = useCallback(async () => {
        try {
            const supabase = await getSupabaseClient();
            const {
                data: { session },
            } = await supabase.auth.getSession();

            console.log('[AdminLayout] Session check:', session ? 'Found' : 'Not found');
            console.log('[AdminLayout] User email:', session?.user?.email);
            console.log('[AdminLayout] User app_metadata:', session?.user?.app_metadata);
            console.log('[AdminLayout] Configured admin email:', Env.ADMIN_EMAIL);

            if (!session) {
                console.log('[AdminLayout] No session found');
                setAuthState('unauthenticated');
                return;
            }

            // Verify admin role from app_metadata OR explicit email whitelist
            // This ensures the admin email always has access even if role is missing
            const hasRole = hasAdminRole(session.user.app_metadata);
            const isWhitelisted = session.user.email?.toLowerCase() === Env.ADMIN_EMAIL?.toLowerCase();
            
            console.log('[AdminLayout] Has admin role:', hasRole);
            console.log('[AdminLayout] Is whitelisted email:', isWhitelisted);

            if (!hasRole && !isWhitelisted) {
                console.log('[AdminLayout] User does not have admin role - signing out');
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
        // Only check auth on mount, don't re-run
        checkAuth();
    }, []);

    // Listen for auth state changes (e.g., after login)
    useEffect(() => {
        let subscription: { unsubscribe: () => void } | null = null;

        const setupAuthListener = async () => {
            const supabase = await getSupabaseClient();
            const { data } = supabase.auth.onAuthStateChange((event, session) => {
                console.log('[AdminLayout] Auth state change:', event);
                console.log('[AdminLayout] Session in event:', session ? 'Present' : 'Null');

                // Handle SIGNED_IN (after login)
                if (event === 'SIGNED_IN' && session) {
                    console.log('[AdminLayout] SIGNED_IN - checking credentials');
                    console.log('[AdminLayout] User email:', session.user.email);
                    console.log('[AdminLayout] Configured admin email:', Env.ADMIN_EMAIL);
                    
                    const hasRole = hasAdminRole(session.user.app_metadata);
                    const isWhitelisted = session.user.email?.toLowerCase() === Env.ADMIN_EMAIL?.toLowerCase();
                    
                    console.log('[AdminLayout] Has admin role:', hasRole);
                    console.log('[AdminLayout] Is whitelisted:', isWhitelisted);
                    
                    if (hasRole || isWhitelisted) {
                        console.log('[AdminLayout] Setting authenticated state');
                        setAuthState('authenticated');
                    } else {
                        console.log('[AdminLayout] Post-login role check failed');
                        setAuthState('unauthenticated');
                    }
                }
                // Handle SIGNED_OUT
                else if (event === 'SIGNED_OUT') {
                    console.log('[AdminLayout] SIGNED_OUT event');
                    setAuthState('unauthenticated');
                }
                // Ignore INITIAL_SESSION, TOKEN_REFRESHED, USER_UPDATED to avoid loops
                // The initial checkAuth() handles the session check on mount
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
