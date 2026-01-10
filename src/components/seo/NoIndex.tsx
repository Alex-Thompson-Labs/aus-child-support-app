/**
 * NoIndex Component
 * Prevents search engine indexing for private/admin pages
 * Used by admin routes and utility pages like modals
 */
import Head from 'expo-router/head';
import { Platform } from 'react-native';

export const NoIndex = () => {
    if (Platform.OS !== 'web') return null;
    return (
        <Head>
            <meta name="robots" content="noindex, nofollow" />
        </Head>
    );
};
