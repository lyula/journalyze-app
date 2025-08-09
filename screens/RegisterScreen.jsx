import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'dripsy';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const PRIMARY = '#a99d6b';
const PRIMARY_BLUE = '#1E3A8A';

const Container = styled(SafeAreaView)({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 16,
  backgroundColor: '#f8fafc',
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

const GenderButton = styled(TouchableOpacity)(({ selected }) => ({
  flex: 1,
  paddingVertical: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: selected ? PRIMARY : '#ccc',
  backgroundColor: selected ? PRIMARY : '#f9fafb',
  alignItems: 'center',
  marginHorizontal: 4,
}));

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState(null);
  const [showDate, setShowDate] = useState(false);
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    // TODO: Connect to backend API
    if (!username || !email || !password || !confirm || !gender || !dob || !country) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    navigation.replace('Post');
  };

  return (
    <Container>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: PRIMARY_BLUE, marginBottom: 24, textAlign: 'center' }}>
        Create Account
      </Text>
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#b3b3b3"
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#b3b3b3"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#b3b3b3"
      />
      <Input
        placeholder="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholderTextColor="#b3b3b3"
      />
      <View style={{ width: '100%', marginBottom: 16 }}>
        <Text style={{ marginBottom: 6, color: '#222', fontWeight: 'bold' }}>Gender</Text>
        <View style={{ borderWidth: 1, borderColor: PRIMARY, borderRadius: 8, backgroundColor: '#f9fafb' }}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={{ width: '100%' }}
          >
            <Picker.Item label="Select gender" value="" color="#b3b3b3" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>
      <TouchableOpacity style={styles.dobBtn} onPress={() => setShowDate(true)}>
        <Text style={{ color: dob ? '#222' : '#b3b3b3', fontSize: 16 }}>
          {dob ? dob.toLocaleDateString() : 'Date of Birth'}
        </Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker
          value={dob || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDate(false);
            if (selectedDate) setDob(selectedDate);
          }}
          maximumDate={new Date()}
        />
      )}
      <Input
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
        autoCapitalize="words"
        placeholderTextColor="#b3b3b3"
      />
      {error ? (
        <Text style={{ color: 'red', marginBottom: 8, marginTop: 8, textAlign: 'center' }}>{error}</Text>
      ) : null}
      <Button onPress={handleRegister}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Register</Text>
      </Button>
      <Text style={{ marginTop: 24, color: '#666', textAlign: 'center' }}>
        Already have an account?{' '}
        <Text style={{ color: PRIMARY_BLUE, fontWeight: 'bold' }} onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  dobBtn: {
    width: '100%',
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    alignItems: 'flex-start',
  },
});
