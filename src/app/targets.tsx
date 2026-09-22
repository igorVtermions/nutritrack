import { useRouter } from 'expo-router';
import { TargetsScreen } from '@/features/settings/TargetsScreen';
export default function Targets() {
  const router = useRouter();
  return <TargetsScreen onBack={() => router.back()} />;
}
