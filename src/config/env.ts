/**
 * Environment configuration
 * Centralizes access to environment variables
 */

export const Env = {
    // Supabase
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,

    // Admin
    // Default to alex@auschildsupport.com.au for backwards compatibility if env var is missing
    ADMIN_EMAIL: process.env.EXPO_PUBLIC_ADMIN_EMAIL || 'alex@auschildsupport.com.au',

    // Site
    SITE_URL: process.env.EXPO_PUBLIC_SITE_URL || 'https://auschildsupport.com.au',

    // EmailJS
    EMAILJS_SERVICE_ID: process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID: process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY,
};
