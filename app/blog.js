import { Stack } from 'expo-router'; // Import Expo Router tools
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 👇 Your actual free WordPress API endpoint
    const API_URL = 'https://public-api.wordpress.com/wp/v2/sites/auschildsupportbackend.wordpress.com/posts';
    
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  // Helper to remove HTML tags (like <p>) for the preview
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace('&nbsp;', ' ');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading articles...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>{stripHtml(item.title.rendered)}</Text>
      
      {/* Excerpt (Preview) */}
      <Text style={styles.excerpt} numberOfLines={3}>
        {stripHtml(item.excerpt.rendered)}
      </Text>

      {/* Button to open full article in browser */}
      <TouchableOpacity 
        onPress={() => Linking.openURL(item.link)} 
        style={styles.button}
      >
        <Text style={styles.buttonText}>Read Full Article</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 👇 This sets the header title automatically */}
      <Stack.Screen options={{ title: 'Latest News' }} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        // 👇 LAYOUT FIX 1: Constrain the width and center the list
        style={styles.listStyle}
        // 👇 LAYOUT FIX 2: Add padding inside the list, not the container
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center', // 👈 CENTERS the content on Desktop
    width: '100%',
  },
  listStyle: {
    width: '100%',
    maxWidth: 800,        // 👈 STOPS it from stretching too wide on Desktop
    flex: 1,
  },
  listContent: {
    padding: 15,          // 👈 Adds the breathing room edges
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
});