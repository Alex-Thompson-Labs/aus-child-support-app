/**
 * Supabase Client Configuration
 *
 * LAZY-LOADED for optimal LCP performance.
 * Supabase client is only initialized when actually needed (user action).
 *
 * Security:
 * - Uses anon key (safe for client-side)
 * - Row Level Security (RLS) policies control access
 * - Anonymous users can only INSERT leads
 * - Admin access requires authentication
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Cache the client instance once initialized
let supabaseInstance: SupabaseClient | null = null;

// Initialization lock to prevent concurrent initialization attempts
let initializationPromise: Promise<SupabaseClient> | null = null;

/**
 * Get Supabase credentials from environment variables
 */
function getSupabaseCredentials() {
    const supabaseUrl =
        Constants.expoConfig?.extra?.supabaseUrl ||
        process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey =
        Constants.expoConfig?.extra?.supabaseAnonKey ||
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    return { supabaseUrl, supabaseAnonKey };
}

/**
 * Lazily initialize Supabase client only when needed
 * This prevents @supabase libraries from being loaded on initial page load
 * 
 * Uses a mutex pattern to ensure that concurrent calls during app launch
 * all wait for the same initialization promise rather than creating
 * multiple client instances.
 */
export async function getSupabaseClient(): Promise<SupabaseClient> {
    // Return cached instance if already initialized
    if (supabaseInstance) {
        return supabaseInstance;
    }

    // If initialization is in progress, wait for it to complete
    if (initializationPromise) {
        return initializationPromise;
    }

    // Start initialization and store the promise
    initializationPromise = (async () => {
        try {
            // Dynamically import Supabase only when needed
            const { createClient } = await import('@supabase/supabase-js');
            const { supabaseUrl, supabaseAnonKey } = getSupabaseCredentials();

            // Validate credentials
            if (!supabaseUrl) {
                // TODO: Replace with proper error reporting service
            }

            if (!supabaseAnonKey) {
                // TODO: Replace with proper error reporting service
            }

            // Create and cache Supabase client
            supabaseInstance = createClient(supabaseUrl || '', supabaseAnonKey || '', {
                auth: {
                    // Enable auth for admin panel
                    // Anonymous form submissions don't require auth
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: false,
                },
            });

            return supabaseInstance;
        } catch (error) {
            // Clear the initialization promise on error so retries can occur
            initializationPromise = null;
            throw error;
        }
    })();

    return initializationPromise;
}

/**
 * Get the Supabase client instance (for compatibility with existing code)
 * WARNING: This will dynamically load Supabase libraries. Use sparingly.
 */
export const supabase = new Proxy({} as SupabaseClient, {
    get: function (_target, prop) {
        throw new Error(
            `[Supabase] Direct access to 'supabase.${String(prop)}' is not allowed. ` +
            `Use getSupabaseClient() instead for lazy loading.`
        );
    },
});

/**
 * Check if Supabase is configured and accessible
 */
export async function checkSupabaseConnection(): Promise<boolean> {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseCredentials();

    if (!supabaseUrl || !supabaseAnonKey) {
        // TODO: Replace with proper error reporting service
        return false;
    }

    try {
        // Lazy-load Supabase client for connection test
        const supabaseClient = await getSupabaseClient();

        // Try a simple query to test connection
        const { error } = await supabaseClient.from('leads').select('id').limit(1);

        if (error) {
            // TODO: Replace with proper error reporting service
            return false;
        }

        return true;
    } catch (error) {
        // TODO: Replace with proper error reporting service
        return false;
    }
}
