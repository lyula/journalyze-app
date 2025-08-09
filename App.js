import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DripsyProvider } from 'dripsy';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './screens/RegisterScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import PostScreen from './screens/PostScreen.jsx';
import TermsScreen from './screens/TermsScreen.jsx';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <DripsyProvider theme={{}}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Post" component={PostScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </DripsyProvider>
    </SafeAreaProvider>
  );
}
