import { useLocalSearchParams, useRouter } from 'expo-router';
import { FoodDetailsScreen } from '@/features/food-catalog/FoodDetailsScreen';
import { isLocalDate, localDate } from '@/shared/date/localDate';
export default function FoodDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  return (
    <FoodDetailsScreen
      foodId={typeof params.foodId === 'string' ? params.foodId : ''}
      date={isLocalDate(params.date) ? params.date : localDate()}
      onBack={() => router.back()}
      onDone={() => router.dismissTo('/(tabs)/today')}
    />
  );
}
