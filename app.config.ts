import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: config.name ?? 'vibe-coach-app',
    slug: config.slug ?? 'vibe-coach-app',
    plugins: [
      'expo-secure-store',
    ],
    extra: {
      ...(config.extra || {}),
      apiUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:5010',
    },
  } as ExpoConfig;
};
