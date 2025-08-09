import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


// You can swap this for your actual logo asset
const LOGO = require('../assets/icon.png');
const GOLD = '#a99d6b';
const BLUE = '#1E3A8A';

export default function MainHeader({ onMenu, onCommunity, onMessages, onNotifications, onProfile }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>  
      {/* Left: Menu icon */}
      <TouchableOpacity style={styles.iconButton} onPress={onMenu}>
        <Icon name="bars" size={30} color={GOLD} />
      </TouchableOpacity>
      {/* Center: Title only, moved closer to menu */}
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Journalyze</Text>
      </View>
      {/* Right: Community, Messages, Notification, Profile icons */}
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={onCommunity}>
          <FA5Icon name="users" size={20} color={GOLD} solid />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onMessages}>
          <Icon name="envelope" size={20} color={GOLD} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onNotifications}>
          <Icon name="bell" size={20} color={GOLD} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onProfile}>
          <Icon name="user-circle" size={22} color={GOLD} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 8,
    minHeight: 56,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BLUE,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
