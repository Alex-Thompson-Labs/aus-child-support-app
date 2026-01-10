import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

export default function BlogPost() {
  const { id } = useLocalSearchParams(); // Get the ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!id) return;

    // Fetch just this one specific post
    fetch(
      `https://public-api.wordpress.com/wp/v2/sites/auschildsupportbackend.wordpress.com/posts/${id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0056b3" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>Article not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dynamic Header Title */}
      <Stack.Screen options={{ title: 'Article' }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.articleWrapper} accessibilityRole="article">
          {/* Title */}
          <Text style={styles.title}>{post.title.rendered}</Text>

          {/* Date */}
          <Text style={styles.date}>
            {new Date(post.date).toLocaleDateString()}
          </Text>

          {/* The Article Content (HTML) */}
          <RenderHtml
            contentWidth={width > 800 ? 760 : width - 40}
            source={{ html: post.content.rendered }}
            tagsStyles={{
              p: {
                fontSize: 18,
                lineHeight: 28,
                marginBottom: 16,
                color: '#333',
              },
              h2: {
                fontSize: 24,
                fontWeight: 'bold',
                marginTop: 20,
                marginBottom: 10,
                color: '#111',
              },
              h3: {
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 15,
                marginBottom: 8,
              },
              li: { fontSize: 18, lineHeight: 28, marginBottom: 8 },
              a: { color: '#0056b3', textDecorationLine: 'none' },
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center', // Centers content on Desktop
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center', // Keeps the article column centered
    paddingVertical: 30,
  },
  articleWrapper: {
    width: '100%',
    maxWidth: 800, // Reads like a Medium article on Desktop
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
    color: '#0f172a', // slate-900 (Dark Slate)
    lineHeight: 40,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
