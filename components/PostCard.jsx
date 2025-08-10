
import { Video, Audio } from 'expo-av';
import PostInteractions from './PostInteractions';
import { getTotalCommentCount } from '../utils/api';

// Test with a different local asset
const TEST_BADGE = require('../assets/pwa-192x192.png');



import { StyleSheet } from 'react-native';
import { View, Text, Image } from 'react-native';
const VERIFIED_BADGE = require('../assets/blue-badge.png');

export default function PostCard({ post }) {
  const profileImage = post.author?.profile?.profileImage;
  const username = post.author?.username || post.author?.name || post.author || 'Unknown Author';
  // Only check post.author.verified, matching web logic
  const isVerified = !!post.author?.verified;
  return (
    <View style={styles.card}>
      {/* Author row at the top */}
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10 }}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <MaterialCommunityIcons name="account-circle" size={32} color="#bbb" style={styles.profileImage} />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.author}>{username}</Text>
          {isVerified && (
            <Image
              source={{ uri: 'https://zack-lyula-portfolio.vercel.app/images/blue-badge.png' }}
              style={{ width: 18, height: 18, marginLeft: 4 }}
              resizeMode="contain"
              accessibilityLabel="Verified badge"
            />
          )}
        </View>
      </View>
      {/* Media (image, video, audio) */}
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
      {/* Content below media */}
      <Text style={styles.content}>{post.content}</Text>
      {/* Likes count is displayed in PostInteractions, not here */}
      <PostInteractions
        postId={post._id}
        liked={post.liked}
        likesCount={typeof post.likesCount === 'number' ? post.likesCount : (Array.isArray(post.likes) ? post.likes.length : 0)}
        views={post.views}
        initialCommentsCount={getTotalCommentCount(post.comments)}
        // onCommentPress, onSharePress can be added as needed
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 4,
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
});
