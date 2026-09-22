import { useRouter } from 'expo-router';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
export default function Settings() {
  const router = useRouter();
  return <SettingsScreen onTargets={() => router.push('/targets')} />;
}
