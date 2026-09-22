import { useRef, useState } from 'react';
export function useSubmission() {
  const locked = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(action: () => Promise<void>) {
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    setError(null);
    try {
      await action();
    } catch {
      setError(
        'Couldn’t save your changes. Your previous data is safe. Please try again.',
      );
    } finally {
      locked.current = false;
      setPending(false);
    }
  }
  return { pending, error, submit };
}
