import { NoIndex } from '@/src/components/seo/NoIndex';
import { createShadow } from '@/src/utils/shadow-styles';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // WordPress API URL
    const API_URL =
      'https://public-api.wordpress.com/wp/v2/sites/auschildsupportbackend.wordpress.com/posts';

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  // Helper to remove HTML tags for the preview text
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace('&nbsp;', ' ');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <NoIndex />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading articles...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card} accessibilityRole="article">
      {/* Title */}
      <Text style={styles.title}>{stripHtml(item.title.rendered)}</Text>

      {/* Excerpt (Preview) */}
      <Text style={styles.excerpt} numberOfLines={3}>
        {stripHtml(item.excerpt.rendered)}
      </Text>

      {/* Link to internal Reader page */}
      <TouchableOpacity
        onPress={() => router.push(`/blog/${item.id}`)}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={`Read article: ${stripHtml(item.title.rendered)}`}
      >
        <Text style={styles.buttonText}>Read Article</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* NoIndex: Main blog is at blog.auschildsupport.com - this is just in-app reader */}
      <NoIndex />
      <Stack.Screen options={{ title: 'Latest News' }} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.listStyle}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    width: '100%',
  },
  listStyle: {
    width: '100%',
    maxWidth: 800,
    flex: 1,
  },
  listContent: {
    padding: 15,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    ...createShadow({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  excerpt: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#0056b3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
