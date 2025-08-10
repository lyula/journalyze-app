import { useEffect, useState, useRef } from 'react';
import { Modal, TouchableOpacity, View, Dimensions, StyleSheet, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDashboard } from '../context/dashboard';
import FollowButton from './FollowButton';
import { Video, Audio } from 'expo-av';
import PostInteractions from './PostInteractions';
import { getTotalCommentCount } from '../utils/api';
import { getProfile } from '../utils/user';
import { formatDurationAgo } from '../utils/time';

// Helper component to clamp menu position within the screen and align right below the icon
const MenuPositioner = ({ menuAnchor, children }) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const menuWidth = 200;
  const menuHeight = 100;
  const left = Math.max(8, Math.min(menuAnchor.x, screenWidth - menuWidth - 8));
  const top = Math.max(8, Math.min(menuAnchor.y, screenHeight - menuHeight - 8));
  return (
    <View style={{ position: 'absolute', left, top, minWidth: menuWidth, zIndex: 100 }}>
      {children}
    </View>
  );
};

export default function PostCard({ post }) {
  const { isLikedByUser, userId } = useDashboard();
  const liked = isLikedByUser(post.likes);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const menuIconRef = useRef(null);

  // Dummy handlers for edit/delete (replace with real logic)
  const handleEdit = () => {
    setMenuVisible(false);
    // TODO: Implement edit logic
    alert('Edit post');
  };
  const handleDelete = () => {
    setMenuVisible(false);
    // TODO: Implement delete logic
    alert('Delete post');
  };

  const isAuthor = userId === (post.author._id || post.author.id);

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
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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
          {!post.author.isFollowedByMe && (
            <FollowButton userId={post.author._id || post.author.id} />
          )}
          {/* Author-only three-dots menu */}
          {isAuthor && (
            <TouchableOpacity
              ref={menuIconRef}
              onPress={() => {
                if (menuIconRef.current && menuIconRef.current.measure) {
                  menuIconRef.current.measure((fx, fy, width, height, px, py) => {
                    setMenuAnchor({ x: px, y: py + height });
                    setMenuVisible(true);
                  });
                } else {
                  setMenuVisible(true);
                }
              }}
              style={{ marginLeft: 8, padding: 4 }}
            >
              <MaterialIcons name="more-vert" size={22} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Author menu modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setMenuVisible(false)}>
          <MenuPositioner menuAnchor={menuAnchor}>
            <View style={styles.menuModal}>
              <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                <MaterialIcons name="edit" size={20} color="#007AFF" />
                <Text style={styles.menuText}>Edit Post</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                <MaterialIcons name="delete" size={20} color="#FF3B30" />
                <Text style={[styles.menuText, { color: '#FF3B30' }]}>Delete Post</Text>
              </TouchableOpacity>
            </View>
          </MenuPositioner>
        </TouchableOpacity>
      </Modal>
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
    marginLeft: 6,
    marginTop: 1,
  },
  badgeTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
    marginTop: 77,
  },
  badgeText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 1,
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
  // Modal styles for menu
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuModal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#222',
  },
});
