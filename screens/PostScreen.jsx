
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { styled } from 'dripsy';
import FeedHeader from '../components/FeedHeader.jsx';
import MainHeader from '../components/MainHeader.jsx';

const Container = styled(ScrollView)({
  flex: 1,
  padding: 16,
  backgroundColor: '#fff',
});

const Input = styled(TextInput)({
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
  fontSize: 16,
});

export default function PostScreen({ navigation }) {
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('forYou');

  const handlePost = () => {
    setContent('');
    alert('Post created!');
  };
  const handleSearch = () => {
    alert('Search tapped!');
  };
  const handleCreatePost = () => {
    setContent('');
    alert('Ready to create a new post!');
  };
  // MainHeader handlers (replace with real logic as needed)
  const handleMenu = () => alert('Menu tapped!');
  const handleCommunity = () => alert('Community tapped!');
  const handleMessages = () => alert('Messages tapped!');
  const handleNotifications = () => alert('Notifications tapped!');
  const handleProfile = () => alert('Profile tapped!');

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <MainHeader
        onMenu={handleMenu}
        onCommunity={handleCommunity}
        onMessages={handleMessages}
        onNotifications={handleNotifications}
        onProfile={handleProfile}
      />
      <FeedHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearch={handleSearch}
        onCreatePost={handleCreatePost}
      />
      <Container contentContainerStyle={{ flexGrow: 1 }} />
    </View>
  );
}
