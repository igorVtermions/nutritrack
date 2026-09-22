import { useLocalSearchParams, useRouter } from 'expo-router';
import { MealDetailsScreen } from '@/features/diary/MealDetailsScreen';
export default function MealDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  return (
    <MealDetailsScreen
      entryId={typeof params.entryId === 'string' ? params.entryId : ''}
      onBack={() => router.back()}
    />
  );
}
