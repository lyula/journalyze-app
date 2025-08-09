import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'dripsy';

const PRIMARY = '#a99d6b';
const PRIMARY_BLUE = '#1E3A8A';

const Container = styled(SafeAreaView)({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 16,
  backgroundColor: '#f8fafc', // blue-50
});

const Card = styled(View)({
  width: '100%',
  maxWidth: 400,
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 24,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  alignItems: 'center',
});

const Input = styled(TextInput)({
  width: '100%',
  borderWidth: 1,
  borderColor: PRIMARY,
  borderRadius: 8,
  padding: 12,
  marginBottom: 16,
  fontSize: 16,
  backgroundColor: '#f9fafb',
  color: '#222',
});

const Button = styled(TouchableOpacity)({
  width: '100%',
  backgroundColor: PRIMARY,
  paddingVertical: 14,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 8,
});

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    // TODO: Connect to backend API
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    navigation.replace('Post');
  };

  return (
    <Container>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: PRIMARY_BLUE, marginBottom: 24, textAlign: 'center' }}>
        Welcome Back
      </Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#b3b3b3"
      />
      <View style={{ width: '100%', position: 'relative' }}>
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor="#b3b3b3"
          style={{ marginBottom: 0 }}
        />
        <TouchableOpacity
          style={styles.showHide}
          onPress={() => setShowPassword((v) => !v)}
        >
          <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <Text style={{ color: 'red', marginBottom: 8, marginTop: 8, textAlign: 'center' }}>{error}</Text>
      ) : null}
      <Button onPress={handleLogin}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Login</Text>
      </Button>
      <Text style={{ marginTop: 24, color: '#666', textAlign: 'center' }}>
        Don't have an account?{' '}
        <Text style={{ color: PRIMARY_BLUE, fontWeight: 'bold' }} onPress={() => navigation.navigate('Register')}>
          Register
        </Text>
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  showHide: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 2,
  },
});
