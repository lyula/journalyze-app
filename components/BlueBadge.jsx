import React from 'react';
import { Image } from 'react-native';

// Local asset for blue badge
const BADGE = require('../assets/blue-badge.png');

export default function BlueBadge({ style }) {
  return (
    <Image
      source={BADGE}
      style={[{ width: 16, height: 16, marginLeft: 4 }, style]}
      resizeMode="contain"
      accessibilityLabel="Verified badge"
    />
  );
}
