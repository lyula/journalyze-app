
import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import AdsInteractions from './AdsInteractions';
import { fetchAds } from '../utils/api';

export default function AdsSection() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAds()
      .then(setAds)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="small" style={{ marginTop: 16 }} />;
  if (error) return <Text style={{ color: 'red', margin: 16 }}>{error}</Text>;
  if (!ads.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sponsored</Text>
      <FlatList
        data={ads}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.adCard}>
            {item.image && <Image source={{ uri: item.image }} style={styles.adImage} />}
            <Text style={styles.adTitle}>{item.title}</Text>
            <Text style={styles.adDesc}>{item.description}</Text>
            <AdsInteractions
              adId={item._id}
              liked={item.liked}
              likesCount={item.likesCount}
              commentsCount={item.commentsCount}
              views={item.views}
              // onCommentPress, onSharePress can be added as needed
            />
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
    color: '#a99d6b',
  },
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 12,
    padding: 12,
    width: 220,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
    alignItems: 'center',
  },
  adImage: {
    width: 180,
    height: 90,
    borderRadius: 8,
    marginBottom: 8,
  },
  adTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  adDesc: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});
