import { Link, Stack } from 'expo-router';
import Head from 'expo-router/head';
import { Platform, StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.container}>
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.message}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to Calculator</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },
  message: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
});
