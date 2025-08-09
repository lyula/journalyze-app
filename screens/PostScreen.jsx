import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { styled } from 'dripsy';

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

export default function PostScreen() {
  const [content, setContent] = useState('');

  const handlePost = () => {
    // TODO: Connect to backend API to create a post
    setContent('');
    alert('Post created!');
  };

  return (
    <Container contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 24 }}>Create a Post</Text>
      <Input
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: 'top' }}
      />
      <Button title="Post" onPress={handlePost} />
    </Container>
  );
}
