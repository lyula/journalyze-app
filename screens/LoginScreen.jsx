import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'dripsy';
import AsyncStorage from '@react-native-async-storage/async-storage';

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




import Constants from 'expo-constants';
const API_BASE =
  (Constants.manifest?.extra?.API_BASE_URL ||
   Constants.expoConfig?.extra?.API_BASE_URL ||
   process.env.API_BASE_URL ||
   'http://192.168.100.37:5000/api');

async function loginUser({ email, password }) {
  try {
    console.log('[LOGIN] API_BASE:', API_BASE);
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const text = await res.text();
    console.log('[LOGIN] Response status:', res.status, 'Body:', text);
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Server error: " + text);
    }
  } catch (err) {
    console.error('[LOGIN] Network or fetch error:', err);
    throw err;
  }
}

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      setLoading(false);
      if (result.token) {
        await AsyncStorage.setItem('token', result.token);
        navigation.replace('Post');
      } else {
        console.log('[LOGIN] No token, error:', result.message);
        setError(result.message || 'Login failed.');
      }
    } catch (err) {
      setLoading(false);
      console.error('[LOGIN] handleLogin error:', err);
      setError(err.message || 'Login failed.');
    }
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
