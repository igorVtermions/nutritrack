import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { ActivityIndicator } from 'react-native';
import { LocalDiaryRepository } from '@/data/repositories/LocalDiaryRepository';
import { demoCatalog } from '@/data/fixtures/catalog';
import type {
  DiaryRepository,
  DiaryState,
} from '@/features/diary/model/DiaryRepository';
import type { Food } from '@/domain/nutrition/model';
import { AppText, Button, Screen } from '@/design-system/components';
type ContextValue = {
  state: DiaryState;
  catalog: readonly Food[];
  update: DiaryRepository['update'];
};
const Context = createContext<ContextValue | null>(null);
export function AppProvider({ children }: PropsWithChildren) {
  const [repository] = useState(() => new LocalDiaryRepository(AsyncStorage));
  const [result, setResult] = useState<
    | { status: 'loading' }
    | { status: 'error' }
    | { status: 'ready'; state: DiaryState }
  >({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    repository.load().then(
      (state) => {
        if (active) setResult({ status: 'ready', state });
      },
      () => {
        if (active) setResult({ status: 'error' });
      },
    );
    return () => {
      active = false;
    };
  }, [repository, attempt]);
  if (result.status === 'loading')
    return (
      <Screen>
        <ActivityIndicator accessibilityLabel="Loading your diary" />
        <AppText>Opening your space…</AppText>
      </Screen>
    );
  if (result.status === 'error')
    return (
      <Screen>
        <AppText variant="title">Couldn’t open your diary</AppText>
        <AppText>
          Your saved data has not been changed. Please try again.
        </AppText>
        <Button
          label="Try again"
          onPress={() => {
            setResult({ status: 'loading' });
            setAttempt((value) => value + 1);
          }}
        />
      </Screen>
    );
  async function update(change: (state: DiaryState) => DiaryState) {
    const state = await repository.update(change);
    setResult({ status: 'ready', state });
    return state;
  }
  return (
    <Context.Provider
      value={{
        state: result.state,
        update,
        catalog: [...demoCatalog, ...result.state.customFoods],
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDiary() {
  const value = useContext(Context);
  if (!value) throw new Error('AppProvider is required');
  return value;
}
