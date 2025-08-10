import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Modal } from 'react-native';
import { getPostLikes } from '../utils/api';

export default function PostLikesModal({ visible, postId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [likers, setLikers] = useState([]);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getPostLikes(postId)
      .then(res => setLikers(res.likes || []))
      .catch(() => setLikers([]))
      .finally(() => setLoading(false));
  }, [visible, postId]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Likes</Text>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 32 }} />
          ) : likers.length === 0 ? (
            <Text style={styles.empty}>No users found.</Text>
          ) : (
            <FlatList
              data={likers}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.likerRow}>
                  {item.profile?.profileImage || item.profileImage ? (
                    <Image source={{ uri: item.profile?.profileImage || item.profileImage }} style={styles.avatarLarge} />
                  ) : (
                    <View style={styles.avatarPlaceholderLarge}>
                      <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                        style={styles.userIcon}
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  <Text style={styles.usernameLarge}>{item.username}</Text>
                  {item.verified && (
                    <Image source={{ uri: 'https://zack-lyula-portfolio.vercel.app/images/blue-badge.png' }} style={styles.badgeTight} />
                  )}
                </View>
              )}
            />
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  // overlay removed, handled by BottomSheet
  // modal removed, handled by BottomSheet
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    color: '#888',
    marginTop: 32,
  },
  resultsList: {
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
  likerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    width: 'auto',
    alignSelf: 'flex-start',
  },
  avatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    backgroundColor: '#eee',
  },
  avatarPlaceholderLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userIcon: {
    width: 32,
    height: 32,
    tintColor: '#888',
    borderRadius: 0,
  },
  usernameLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginRight: 8,
  },
  badgeLarge: {
    width: 20,
    height: 20,
    marginLeft: 2,
  },
  badgeTight: {
    width: 20,
    height: 20,
    marginLeft: 0,
  },
  closeBtn: {
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '70%',
    alignItems: 'center',
  },
});
