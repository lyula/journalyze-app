import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { likeAd, viewAd } from '../utils/api';

export default function AdsInteractions({
  adId,
  liked: likedProp = false,
  likesCount: likesCountProp = 0,
  commentsCount = 0,
  onCommentPress,
  onSharePress,
  views = 0,
}) {
  const [liked, setLiked] = useState(likedProp);
  const [likesCount, setLikesCount] = useState(likesCountProp);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await likeAd(adId);
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    } catch (e) {
      // Optionally show error
    }
    setLoading(false);
  };

  // Optionally, call viewAd(adId) on mount or when ad is visible

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity onPress={handleLike} style={styles.iconBtn} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#e11d48" />
          ) : liked ? (
            <Ionicons name="heart" size={22} color="#e11d48" />
          ) : (
            <Ionicons name="heart-outline" size={22} color="#6b7280" />
          )}
        </TouchableOpacity>
        <Text style={[styles.count, liked && { color: '#e11d48' }]}>{likesCount}</Text>
        <TouchableOpacity onPress={onCommentPress} style={styles.iconBtn}>
          <Feather name="message-circle" size={22} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.count}>{commentsCount}</Text>
        <TouchableOpacity onPress={onSharePress} style={styles.iconBtn}>
          <Feather name="share-2" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        <Feather name="bar-chart-2" size={18} color="#6b7280" />
        <Text style={styles.views}>{views}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: 4,
    borderRadius: 16,
  },
  count: {
    fontSize: 15,
    color: '#6b7280',
    marginHorizontal: 2,
    fontWeight: '500',
  },
  views: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 2,
  },
});
