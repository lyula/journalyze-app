
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { likePost } from '../utils/api';

export default function PostInteractions({
  postId,
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
      await likePost(postId);
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    } catch (e) {
      // Optionally show error
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
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
        <View style={styles.viewsBox}>
          <Feather name="bar-chart-2" size={18} color="#6b7280" />
          <Text style={styles.views}>{views}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 12,
    marginBottom: 12,
    marginHorizontal: 0,
    paddingVertical: 2,
    paddingHorizontal: 0,
    width: '100%',
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  viewsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
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
    fontWeight: '500',
  },
});
