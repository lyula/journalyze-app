import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getProfile } from '../utils/user';
import { getPostById, getPostComments, likePost } from '../utils/api';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    setLoadingUser(true);
    getProfile()
      .then(profile => {
        setUser(profile);
        setUserId(profile._id || profile.id);
      })
      .catch(() => {
        setUser(null);
        setUserId(null);
      })
      .finally(() => setLoadingUser(false));
  }, []);

  // Helper: check if user liked a comment/reply
  const isLikedByUser = useCallback((likesArray) => {
    if (!Array.isArray(likesArray) || !userId) return false;
    return likesArray.some(like =>
      typeof like === 'string' ? like === userId : (like._id === userId || like.id === userId)
    );
  }, [userId]);

  // Helper: like/unlike a post (expand for comments as needed)
  const likePostById = useCallback(async (postId) => {
    await likePost(postId);
  }, []);

  const value = useMemo(() => ({
    user,
    userId,
    loadingUser,
    isLikedByUser,
    likePostById,
  }), [user, userId, loadingUser, isLikedByUser, likePostById]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider');
  return ctx;
}
