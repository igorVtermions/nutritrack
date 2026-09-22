import { useLocalSearchParams, useRouter } from 'expo-router';
import { CreateFoodScreen } from '@/features/food-catalog/CreateFoodScreen';
import { isLocalDate, localDate } from '@/shared/date/localDate';
export default function CreateFood() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const date = isLocalDate(params.date) ? params.date : localDate();
  return (
    <CreateFoodScreen
      onBack={() => router.back()}
      onCreated={(foodId) =>
        router.replace({ pathname: '/food/[foodId]', params: { foodId, date } })
      }
    />
  );
}
