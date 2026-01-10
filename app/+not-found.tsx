import { Link, Stack } from 'expo-router';
import Head from 'expo-router/head';
import { Platform, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Noindex component for SEO - prevents 404 page from being indexed
const NoIndex = () => {
    if (Platform.OS !== 'web') return null;
    return (
        <Head>
            <title>Page Not Found | AusChildSupport</title>
            <meta name="robots" content="noindex, nofollow" />
        </Head>
    );
};

export default function NotFoundScreen() {
    return (
        <>
            <NoIndex />
            <Stack.Screen options={{ title: 'Page Not Found' }} />
            <ThemedView style={styles.container}>
                <ThemedText type="title">Page Not Found</ThemedText>
                <ThemedText style={styles.message}>
                    The page you're looking for doesn't exist or has been moved.
                </ThemedText>
                <Link href="/" style={styles.link}>
                    <ThemedText type="link">Return to Calculator</ThemedText>
                </Link>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    message: {
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
        color: '#64748b',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
