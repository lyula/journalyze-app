import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import BottomSheet from './BottomSheet';
import { getPostLikes, followUser, unfollowUser } from '../utils/api';

export default function PostLikesBottomSheet({ visible, postId, onClose, currentUserId }) {
  const [loading, setLoading] = useState(false);
  const [likers, setLikers] = useState([]);
  const [followLoading, setFollowLoading] = useState({});
  const [followStates, setFollowStates] = useState({});

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getPostLikes(postId)
      .then(res => {
        setLikers(res.likes || []);
        // Set follow states for each user (if currentUserId is provided)
        const states = {};
        (res.likes || []).forEach(user => {
          states[user._id] = Array.isArray(user.followersHashed)
            ? user.followersHashed.includes(currentUserId)
            : false;
        });
        setFollowStates(states);
      })
      .catch(() => setLikers([]))
      .finally(() => setLoading(false));
  }, [visible, postId, currentUserId]);

  const handleFollow = async (userId) => {
    setFollowLoading(fl => ({ ...fl, [userId]: true }));
    setFollowStates(fs => ({ ...fs, [userId]: true }));
    try {
      await followUser(userId);
    } catch {}
    setFollowLoading(fl => ({ ...fl, [userId]: false }));
  };
  const handleUnfollow = async (userId) => {
    setFollowLoading(fl => ({ ...fl, [userId]: true }));
    setFollowStates(fs => ({ ...fs, [userId]: false }));
    try {
      await unfollowUser(userId);
    } catch {}
    setFollowLoading(fl => ({ ...fl, [userId]: false }));
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={480}>
      <View style={styles.fullWidthContent}>
        <Text style={styles.title}>Likes</Text>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 32 }} />
        ) : likers.length === 0 ? (
          <Text style={styles.empty}>No users found.</Text>
        ) : (
          <FlatList
            data={likers}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={styles.likerRow}>
                <View style={styles.leftSection}>
                  {item.profile?.profileImage || item.profileImage ? (
                    <Image source={{ uri: item.profile?.profileImage || item.profileImage }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder} />
                  )}
                  <Text style={styles.username}>{item.username}</Text>
                  {item.verified && (
                    <Image source={{ uri: 'https://zack-lyula-portfolio.vercel.app/images/blue-badge.png' }} style={styles.badge} />
                  )}
                </View>
                {currentUserId && item._id !== currentUserId && (
                  followStates[item._id] ? (
                    <TouchableOpacity
                      style={styles.followBtn}
                      disabled={followLoading[item._id]}
                      onPress={() => handleUnfollow(item._id)}
                    >
                      <Text style={styles.followBtnText}>{followLoading[item._id] ? '...' : 'Following'}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.followBtn, styles.followBtnActive]}
                      disabled={followLoading[item._id]}
                      onPress={() => handleFollow(item._id)}
                    >
                      <Text style={[styles.followBtnText, styles.followBtnActiveText]}>{followLoading[item._id] ? '...' : 'Follow'}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          />
        )}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  fullWidthContent: {
    width: '100%',
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 18,
    textAlign: 'left',
  },
  empty: {
    color: '#888',
    marginTop: 32,
    textAlign: 'center',
  },
  likerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  username: {
    fontSize: 19,
    fontWeight: '600',
    color: '#222',
    marginRight: 6,
  },
  badge: {
    width: 20,
    height: 20,
    marginLeft: 2,
  },
  followBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    minWidth: 80,
  },
  followBtnText: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
  },
  followBtnActive: {
    backgroundColor: '#2563eb',
  },
  followBtnActiveText: {
    color: '#fff',
  },
  closeBtn: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});
