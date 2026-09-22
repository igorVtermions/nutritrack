import type { ExpoConfig } from 'expo/config';
import tokens from './design/tokens.json';

const config: ExpoConfig = {
  name: 'NutriTrack',
  slug: 'nutritrack',
  owner: 'igorvtermions',
  extra: {
    eas: { projectId: '325a6cb0-11e9-4349-a7fa-94d25a6c2d5e' },
  },
  version: '0.1.0',
  scheme: 'nutritrack',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  android: { package: 'com.nutritrack.prototype' },
  ios: { bundleIdentifier: 'com.nutritrack.prototype', supportsTablet: false },
  plugins: [
    'expo-router',
    'expo-font',
    'expo-dev-client',
    [
      'expo-splash-screen',
      {
        backgroundColor: tokens.colors.bg,
        image: './assets/images/logo.png',
        imageWidth: 80,
      },
    ],
  ],
  experiments: { typedRoutes: true },
};
export default config;
