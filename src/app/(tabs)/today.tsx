import { useRouter } from 'expo-router';
import { TodayScreen } from '@/features/diary/TodayScreen';
export default function Today() {
  const router = useRouter();
  return (
    <TodayScreen
      onLog={(date) =>
        router.push({ pathname: '/food/search', params: { date } })
      }
      onEntry={(entryId) =>
        router.push({ pathname: '/meal/[entryId]', params: { entryId } })
      }
    />
  );
}
