
import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { fetchPosts, fetchAds } from '../utils/api';
import PostCard from './PostCard';
import AdCard from './AdCard';
import { interleaveAds } from './interleaveAds';

export default function PostsFeed() {
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [endReachedCount, setEndReachedCount] = useState(0);
  const flatListRef = useRef(null);

  // Fetch posts/ads
  const loadFeed = async () => {
    setLoading(true);
    try {
      const [postsData, adsData] = await Promise.all([fetchPosts(), fetchAds()]);
      setPosts(postsData);
      setAds(Array.isArray(adsData.ads) ? adsData.ads : adsData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
    setEndReachedCount(0);
  };

  // Endless loop: when end reached, cycle to start
  const onEndReached = () => {
    if (posts.length === 0) return;
    setEndReachedCount(c => c + 1);
    // After reaching end, scroll to top and cycle
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };


  // Only show error overlay if error
  if (error) return <Text style={{ color: 'red', margin: 16 }}>{error}</Text>;

  // Interleave ads into posts array
  const feedItems = interleaveAds(posts, ads);

  return (
    <FlatList
      ref={flatListRef}
      data={feedItems}
      keyExtractor={(item, idx) => item._id ? `${item._id}-${item._isAd ? 'ad' : 'post'}` : `idx-${idx}`}
      renderItem={({ item, index }) => (
        item._isAd ? (
          <AdCard ad={item} />
        ) : (
          <PostCard post={item} />
        )
      )}
      ListHeaderComponent={null}
      ItemSeparatorComponent={() => (
        <View style={{ width: '100%' }}>
          <View style={{ height: 1, backgroundColor: '#e0e0e0', width: '100%' }} />
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 0, paddingHorizontal: 0, margin: 0 }}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: '#fff', padding: 0, margin: 0 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
    />
  );
}
