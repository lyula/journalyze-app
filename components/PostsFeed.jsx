
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { fetchPosts, fetchAds } from '../utils/api';
import PostCard from './PostCard';
import AdCard from './AdCard';
import { interleaveAds } from './interleaveAds';

export default function PostsFeed() {
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchPosts(), fetchAds()])
      .then(([postsData, adsData]) => {
        setPosts(postsData);
        setAds(Array.isArray(adsData.ads) ? adsData.ads : adsData); // handle both { ads: [...] } and [...] formats
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 32 }} />;
  if (error) return <Text style={{ color: 'red', margin: 16 }}>{error}</Text>;

  // Interleave ads into posts array
  const feedItems = interleaveAds(posts, ads);

  return (
    <FlatList
      data={feedItems}
      keyExtractor={(item, idx) => item._id ? `${item._id}-${item._isAd ? 'ad' : 'post'}` : `idx-${idx}`}
      renderItem={({ item, index }) => (
        item._isAd ? (
          <AdCard ad={item} />
        ) : (
          <PostCard post={item} />
        )
      )}
      ItemSeparatorComponent={() => (
        <View style={{ width: '100%' }}>
          <View style={{ height: 1, backgroundColor: '#e0e0e0', width: '100%' }} />
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 0, paddingHorizontal: 0, margin: 0 }}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: '#fff', padding: 0, margin: 0 }}
    />
  );
}
