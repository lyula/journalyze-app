
import { fetchProfileSuggestions } from '../utils/api';
import BlueBadge from './BlueBadge';
import { getProfile } from '../utils/user';

function getProfileImage(user) {
  if (!user) return '';
  if (user.profile && typeof user.profile === 'object' && user.profile.profileImage) return user.profile.profileImage;
  if (user.profileImage) return user.profileImage;
  if (typeof user.profile === 'string') return user.profile;
  if (user.profileImage) return user.profileImage;
  return '';
}

import React, { useEffect, useState } from 'react';

export default function ProfileSuggestions() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const stored = globalThis.localStorage?.getItem('dismissedSuggestions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [following, setFollowing] = useState([]);

  // Fetch current user and following list
  useEffect(() => {
    getProfile().then(user => {
      setFollowing(user.followingRaw || []);
    });
  }, []);

  // Fetch suggestions
  useEffect(() => {
    setLoading(true);
    fetchProfileSuggestions()
      .then(data => {
        let suggestions = Array.isArray(data.suggestions) ? data.suggestions : data;
        suggestions = suggestions.filter(s => !following.includes(s._id) && !dismissed.includes(s._id));
        suggestions.sort((a, b) => {
          const aHasImage = !!getProfileImage(a);
          const bHasImage = !!getProfileImage(b);
          if (aHasImage && !bHasImage) return -1;
          if (!aHasImage && bHasImage) return 1;
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return 0;
        });
        setProfiles(suggestions);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [dismissed, following]);

  // Persist dismissed users
  useEffect(() => {
    try {
      globalThis.localStorage?.setItem('dismissedSuggestions', JSON.stringify(dismissed));
    } catch {}
  }, [dismissed]);

  const handleDismiss = (id) => setDismissed(prev => [...prev, id]);

  if (loading) return <ActivityIndicator size="small" style={{ marginTop: 16 }} />;
  if (error) return <Text style={{ color: 'red', margin: 16 }}>{error}</Text>;
  if (!profiles.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Who to follow</Text>
      <FlatList
        data={profiles}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.profileCard}>
            {getProfileImage(item) ? <Image source={{ uri: getProfileImage(item) }} style={styles.profileImage} /> : null}
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.username}>{item.username}</Text>
                {(item.verified || item.isVerified) && <BlueBadge />}
              </View>
              {item.bio && <Text style={styles.bio}>{item.bio}</Text>}
            </View>
            <TouchableOpacity onPress={() => handleDismiss(item._id)} style={{ position: 'absolute', top: 6, right: 6, padding: 4 }}>
              <Text style={{ color: '#aaa', fontSize: 16 }}>×</Text>
            </TouchableOpacity>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginLeft: 8,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    marginLeft: 8,
    color: '#1E3A8A',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 12,
    padding: 10,
    width: 160,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eee',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  bio: {
    fontSize: 12,
    color: '#666',
  },
});
