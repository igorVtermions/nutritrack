import { act, renderHook } from '@testing-library/react-native';
import { useSubmission } from './useSubmission';
test('ignores duplicate submission while a write is pending', async () => {
  let finish: () => void = () => undefined;
  const action = jest.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  const { result } = renderHook(() => useSubmission());
  let first: Promise<void> = Promise.resolve();
  act(() => {
    first = result.current.submit(action);
    void result.current.submit(action);
  });
  expect(action).toHaveBeenCalledTimes(1);
  await act(async () => {
    finish();
    await first;
  });
  expect(result.current.pending).toBe(false);
});
test('exposes a recoverable save error', async () => {
  const { result } = renderHook(() => useSubmission());
  await act(async () => {
    await result.current.submit(async () => {
      throw new Error('Disk full');
    });
  });
  expect(result.current.error).toContain('Please try again');
  expect(result.current.pending).toBe(false);
});
