import React, { useEffect, useState, useRef } from 'react';
import { useDashboard } from '../context/dashboard';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { getPostById, getPostComments, getTotalCommentCount } from '../utils/api';
import { Ionicons, Feather } from '@expo/vector-icons';
// Use the exact badge URI and style as post author badge
const VERIFIED_BADGE_URI = 'https://zack-lyula-portfolio.vercel.app/images/blue-badge.png';
const VERIFIED_BADGE_STYLE = { width: 18, height: 18, marginLeft: 1 };

export default function PostComments({ postId, visible, onClose }) {
  const { isLikedByUser } = useDashboard();
  // For every 5 comments, show at least one reply by default (if available)
  React.useEffect(() => {
    if (!Array.isArray(comments) || comments.length === 0) return;
    const newShowReplies = { ...showReplies };
    for (let i = 0; i < comments.length; i += 5) {
      const block = comments.slice(i, i + 5);
      const withReplies = block.filter(c => Array.isArray(c.replies) && c.replies.length > 0);
      if (withReplies.length > 0) {
        // Pick a random comment with replies in this block
        const randomIdx = Math.floor(Math.random() * withReplies.length);
        const commentId = withReplies[randomIdx]._id;
        if (!newShowReplies[commentId]) {
          newShowReplies[commentId] = true;
        }
      }
    }
    setShowReplies(newShowReplies);
  }, [comments]);
  // Add missing renderComment function

  // Track reply pagination state per comment
  const [replyPages, setReplyPages] = useState({}); // { [commentId]: pageNumber }

  const REPLIES_PER_PAGE = 4;

  // Robustly extract the profile image from any author object, handling all backend structures
  // Fallback to DiceBear initials avatar if no image is found
  const getProfileImage = (author) => {
    if (!author) return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    if (author.profile && typeof author.profile === 'object' && author.profile.profileImage) return author.profile.profileImage;
    if (author.profileImage) return author.profileImage;
    if (typeof author.profile === 'string') return author.profile;
    // Some backends may return profileImage as a property of a nested profile object
    if (author.profile && typeof author.profile === 'object' && author.profile.profileImage) return author.profile.profileImage;
    // Some backends may return profileImage as a property of the author object directly
    if (author.profileImage) return author.profileImage;
    // Fallback: show a static default avatar
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  };

  const renderReply = (reply) => {
    const imgUri = getProfileImage(reply.author);
    const isVerified = reply.author?.verified;
    const liked = isLikedByUser(reply.likes);
    return (
      <View style={styles.replyRow} key={reply._id}>
        <Image source={{ uri: imgUri }} style={styles.replyAvatar} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.replyUsername}>{reply.author?.username || reply.author?.name || 'User'}</Text>
            {isVerified && (
              <Image source={{ uri: VERIFIED_BADGE_URI }} style={VERIFIED_BADGE_STYLE} resizeMode="contain" accessibilityLabel="Verified badge" />
            )}
          </View>
          <Text style={styles.replyText}>{reply.text || reply.content || ''}</Text>
          <View style={styles.commentActionsRow}>
            <TouchableOpacity style={styles.likeBtn}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={16} color={liked ? '#e11d48' : '#e11d48'} />
              <Text style={styles.likeCount}>{reply.likes?.length || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReply(reply._id)}>
              <Text style={styles.replyLink}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    inputRef.current?.focus();
  };

  const renderComment = ({ item }) => {
    const hasReplies = Array.isArray(item.replies) && item.replies.length > 0;
    const shouldShowReplies = showReplies[item._id];
    const replyCount = Array.isArray(item.replies) ? item.replies.length : 0;
    const page = replyPages[item._id] || 1;
    const totalPages = hasReplies ? Math.ceil(replyCount / REPLIES_PER_PAGE) : 1;
    const startIdx = (page - 1) * REPLIES_PER_PAGE;
    const endIdx = startIdx + REPLIES_PER_PAGE;
    const visibleReplies = hasReplies && shouldShowReplies ? item.replies.slice(startIdx, endIdx) : [];

    const imgUri = getProfileImage(item.author);
    const isVerified = item.author?.verified;
    const liked = isLikedByUser(item.likes);
    return (
      <View style={styles.commentRow}>
        <Image source={{ uri: imgUri }} style={styles.avatar} />
        <View style={styles.commentContentFlat}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.username}>{item.author?.username || item.author?.name || 'User'}</Text>
            {isVerified && (
              <Image source={{ uri: VERIFIED_BADGE_URI }} style={VERIFIED_BADGE_STYLE} resizeMode="contain" accessibilityLabel="Verified badge" />
            )}
          </View>
          <Text style={styles.commentText}>{item.text || item.content || ''}</Text>
          <View style={styles.commentActionsRow}>
            <TouchableOpacity style={styles.likeBtn}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? '#e11d48' : '#e11d48'} />
              <Text style={styles.likeCount}>{item.likes?.length || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReply(item._id)}>
              <Text style={styles.replyLink}>Reply</Text>
            </TouchableOpacity>
          </View>
          {hasReplies && (
            <View style={styles.repliesBox}>
              {shouldShowReplies ? (
                <>
                  {visibleReplies.map(renderReply)}
                  <View style={{ flexDirection: 'row', marginTop: 4 }}>
                    {page > 1 && (
                      <TouchableOpacity onPress={() => setReplyPages(p => ({ ...p, [item._id]: page - 1 }))}>
                        <Text style={{ color: '#2563eb', fontWeight: '500', marginRight: 16 }}>Prev</Text>
                      </TouchableOpacity>
                    )}
                    {endIdx < replyCount && (
                      <TouchableOpacity onPress={() => setReplyPages(p => ({ ...p, [item._id]: page + 1 }))}>
                        <Text style={{ color: '#2563eb', fontWeight: '500', marginRight: 16 }}>View more</Text>
                      </TouchableOpacity>
                    )}
                    {shouldShowReplies && (
                      <TouchableOpacity onPress={() => {
                        setShowReplies(r => ({ ...r, [item._id]: false }));
                        setReplyPages(p => ({ ...p, [item._id]: 1 }));
                      }}>
                        <Text style={{ color: '#e11d48', fontWeight: '500' }}>Hide replies</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              ) : (
                <TouchableOpacity onPress={() => setShowReplies(r => ({ ...r, [item._id]: true }))}>
                  <Text style={{ color: '#2563eb', fontWeight: '500', marginTop: 2 }}>
                    View {replyCount} repl{replyCount === 1 ? 'y' : 'ies'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };
  // Add missing handleSend function
  const handleSend = () => {
    // TODO: Implement add comment API
    setInput('');
  };
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showReplies, setShowReplies] = useState({}); // { [commentId]: true/false }
  const inputRef = useRef();

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getPostComments(postId)
      .then(comments => {
        setComments(Array.isArray(comments) ? comments : []);
      })
      .catch((err) => {
        setComments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [visible, postId]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modal}>
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={replyTo ? 'Reply to comment...' : 'Add a comment...'}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <Feather name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 32 }} />
          ) : comments.length === 0 ? (
            <Text style={styles.empty}>No comments yet.</Text>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={item => item._id}
              renderItem={renderComment}
              contentContainerStyle={styles.commentsList}
              showsVerticalScrollIndicator={false}
              extraData={showReplies}
            />
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0,
    width: '100%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '100%',
    backgroundColor: '#f9fafb',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222',
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: '#2563eb',
    borderRadius: 20,
    padding: 8,
  },
  commentsList: {
    padding: 16,
    width: '100%',
    alignItems: 'flex-start',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    width: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  commentContentFlat: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  commentActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 2,
    gap: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 15,
    marginRight: 8,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  likeCount: {
    color: '#e11d48',
    fontWeight: '600',
    marginLeft: 2,
    fontSize: 14,
  },
  replyLink: {
    color: '#2563eb',
    fontWeight: '500',
    fontSize: 14,
  },
  commentText: {
    color: '#222',
    fontSize: 15,
    marginTop: 2,
  },
  repliesBox: {
    marginTop: 8,
    marginLeft: 8,
    borderLeftWidth: 2,
    borderColor: '#e5e7eb',
    paddingLeft: 8,
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    width: '100%',
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  replyContentBox: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 7,
  },
  replyUsername: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 14,
    marginBottom: 2,
  },
  replyText: {
    color: '#222',
    fontSize: 14,
  },
  empty: {
    color: '#888',
    marginTop: 32,
    alignSelf: 'center',
  },
  closeBtn: {
    marginTop: 10,
    marginBottom: 18,
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

