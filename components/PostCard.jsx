
import { useEffect, useState } from 'react';
import { useDashboard } from '../context/dashboard';
import FollowButton from './FollowButton';
import { Video, Audio } from 'expo-av';
import PostInteractions from './PostInteractions';
import { getTotalCommentCount } from '../utils/api';
import { getProfile } from '../utils/user';
import { StyleSheet } from 'react-native';
import { View, Text, Image } from 'react-native';
import { formatDurationAgo } from '../utils/time';

export default function PostCard({ post }) {
  const { isLikedByUser, userId } = useDashboard();
  const liked = isLikedByUser(post.likes);
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        {post.author.profileImage || (post.author.profile && post.author.profile.profileImage) ? (
          <Image
            source={{ uri: post.author.profileImage || post.author.profile?.profileImage }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}> 
            <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 18 }}>
              {post.author.username && post.author.username[0] ? post.author.username[0].toUpperCase() : '?'}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.author}>{post.author.username}</Text>
            {post.author.verified && (
              <Image source={require('../assets/blue-badge.png')} style={{ width: 16, height: 16, marginLeft: 4 }} />
            )}
            {post.author.badge && (
              <View style={styles.badgeRow}>
                <Image source={{ uri: post.author.badge.icon }} style={styles.badgeIcon} />
                <Text style={styles.badgeText}>{post.author.badge.name}</Text>
              </View>
            )}
            {/* Dot between badge/verified and time */}
            {(post.author.badge || post.author.verified) && (
              <Text style={styles.dot}> • </Text>
            )}
            <Text style={styles.time}>{formatDurationAgo(post.createdAt)}</Text>
          </View>
        </View>
        {!post.author.isFollowedByMe && (
          <FollowButton userId={post.author._id || post.author.id} />
        )}
      </View>
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} resizeMode="cover" />
      )}
      {post.video && (
        <Video
          source={{ uri: post.video }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          shouldPlay={false}
          isLooping={false}
        />
      )}
      {post.audio && (
        <Audio.Sound
          source={{ uri: post.audio }}
          shouldPlay={false}
        />
      )}
      <Text style={styles.content}>{post.content}</Text>
      <PostInteractions
        postId={post._id}
        liked={liked}
        likesCount={typeof post.likesCount === 'number' ? post.likesCount : (Array.isArray(post.likes) ? post.likes.length : 0)}
        views={post.views}
        initialCommentsCount={getTotalCommentCount(post.comments)}
      />
    </View>
  );
}
// ...existing code...

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 0,
    marginVertical: 0,
    marginHorizontal: 0,
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderColor: 'transparent',
    alignSelf: 'stretch',
    marginTop: 10, // Add space above each post card
  },
  image: {
    width: '100%',
    height: 380, // even taller for less cropping
    borderRadius: 0,
    marginBottom: 0,
  },
  video: {
    width: '100%',
    height: 380,
    backgroundColor: '#000',
    marginBottom: 0,
  },
  author: {
    fontSize: 18,
    color: '#555',
    fontWeight: 'bold',
    paddingHorizontal: 0,
    paddingTop: 2,
    // width removed to allow inline badge
  },
  content: {
    fontSize: 16,
    color: '#222',
    paddingHorizontal: 0,
    paddingBottom: 8,
    // width removed
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // ...existing code...
  },
  badgeTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#007AFF',
    // ...existing code...
  },
  dot: {
    fontWeight: 'bold',
    color: '#888',
    fontSize: 14,
    marginHorizontal: 4,
  },
  time: {
    fontSize: 12,
    color: '#888',
    // ...existing code...
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    // ...existing code...
  },
});
