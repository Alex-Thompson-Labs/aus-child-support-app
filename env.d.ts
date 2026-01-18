declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_SITE_URL: string;
      EXPO_PUBLIC_GA_MEASUREMENT_ID: string;
      EXPO_PUBLIC_ENABLE_ANALYTICS: 'true' | 'false';
      EXPO_PUBLIC_EMAILJS_SERVICE_ID: string;
      EXPO_PUBLIC_EMAILJS_TEMPLATE_ID: string;
      EXPO_PUBLIC_EMAILJS_PUBLIC_KEY: string;
    }
  }
}

export {};
