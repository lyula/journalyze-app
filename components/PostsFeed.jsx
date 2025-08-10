import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { fetchPosts } from '../utils/api';
import PostCard from './PostCard';

export default function PostsFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts()
      .then(data => {
        setPosts(data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 32 }} />;
  if (error) return <Text style={{ color: 'red', margin: 16 }}>{error}</Text>;

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item._id}
      renderItem={({ item, index }) => (
        <>
          <PostCard post={item} />
          {index < posts.length - 1 && (
            <View style={{ width: '100%' }}>
              <View style={{ height: 1, backgroundColor: '#e0e0e0', width: '100%' }} />
            </View>
          )}
        </>
      )}
      contentContainerStyle={{ paddingBottom: 0, paddingHorizontal: 0, margin: 0 }}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: '#fff', padding: 0, margin: 0 }}
    />
  );
}
