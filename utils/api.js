// Utility: Get total comment count (comments + all replies)
export function getTotalCommentCount(comments) {
  if (!Array.isArray(comments)) return 0;
  let count = comments.length;
  for (const c of comments) {
    if (Array.isArray(c.replies)) count += c.replies.length;
  }
  return count;
}
// Get a single post by ID (with comments, likes, replies, etc.)
export async function getPostById(postId) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}
// Get all comments for a post (for counting on client side)
export async function getPostComments(postId) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch post comments');
  const data = await res.json();
  // Web expects { comments: [...] } or array
  if (Array.isArray(data.comments)) return data.comments;
  if (Array.isArray(data)) return data;
  // If the response is a single comment, wrap in array
  if (data && typeof data === 'object') return [data];
  return [];
}
// Get the comments count for a post
export async function getPostCommentsCount(postId) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/posts/${postId}/comments/count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch post comments count');
  const data = await res.json();
  return data.count || 0;
}
// Get users who liked a post
export async function getPostLikes(postId, limit = 100) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/posts/${postId}/likes?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch post likes');
  return res.json();
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE =
  (Constants.manifest?.extra?.API_BASE_URL ||
   Constants.expoConfig?.extra?.API_BASE_URL ||
   process.env.API_BASE_URL ||
   'http://192.168.100.37:5000/api');

async function getToken() {
  return await AsyncStorage.getItem('token');
}

export async function fetchPosts() {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  return data.posts;
}

export async function fetchAds() {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/ads/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch ads');
  return res.json();
}

import { getProfile } from './user';

export async function fetchProfileSuggestions() {
  const token = await getToken();
  const profile = await getProfile();
  const userId = profile._id || profile.id;
  if (!userId) throw new Error('No user id found');
  const res = await fetch(`${API_BASE}/user/suggestions/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch profile suggestions');
  return res.json();
}

// Like a post
export async function likePost(postId) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to like post');
  return res.json();
}

// Like an ad
export async function likeAd(adId) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/ads/${adId}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to like ad');
  return res.json();
}

// View an ad
export async function viewAd(adId) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/ads/${adId}/view`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to record ad view');
  return res.json();
}
