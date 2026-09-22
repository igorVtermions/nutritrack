import { useLocalSearchParams, useRouter } from 'expo-router';
import { CatalogScreen } from '@/features/food-catalog/CatalogScreen';
import { isLocalDate, localDate } from '@/shared/date/localDate';
export default function Search() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const date = isLocalDate(params.date) ? params.date : localDate();
  return (
    <CatalogScreen
      onBack={() => router.back()}
      onSelect={(foodId) =>
        router.push({ pathname: '/food/[foodId]', params: { foodId, date } })
      }
    />
  );
}
