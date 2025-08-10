import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, Image, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';

import { fetchProfileSuggestions } from '../utils/api';
import BlueBadge from './BlueBadge';

export default function ProfileSuggestions() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileSuggestions()
      .then(setProfiles)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
          <TouchableOpacity style={styles.profileCard}>
            {item.profileImage && <Image source={{ uri: item.profileImage }} style={styles.profileImage} />}
            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.username}>{item.username}</Text>
                {(item.verified || item.isVerified) && <BlueBadge />}
              </View>
              {item.bio && <Text style={styles.bio}>{item.bio}</Text>}
            </View>
          </TouchableOpacity>
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
