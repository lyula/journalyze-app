import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useDashboard } from '../context/dashboard';

export default function FollowButton({ authorId, isFollowing, style }) {
  const { userId } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  if (!userId || !authorId || userId === authorId || following) return null;

  const handleFollow = async () => {
    setLoading(true);
    // TODO: Implement followUser API and update context
    // await followUser(authorId);
    setFollowing(true);
    setLoading(false);
  };

  return (
    <TouchableOpacity
      style={[styles.button, style, loading && styles.buttonDisabled]}
      onPress={handleFollow}
      disabled={loading}
    >
      {loading ? <ActivityIndicator size="small" color="#2563eb" /> : <Text style={styles.text}>Follow</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
