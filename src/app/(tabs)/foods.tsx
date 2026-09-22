import { useRouter } from 'expo-router';
import { CatalogScreen } from '@/features/food-catalog/CatalogScreen';
import { localDate } from '@/shared/date/localDate';
export default function Foods() {
  const router = useRouter();
  return (
    <CatalogScreen
      onCreate={() => router.push('/food/create')}
      onSelect={(foodId) =>
        router.push({
          pathname: '/food/[foodId]',
          params: { foodId, date: localDate() },
        })
      }
    />
  );
}
