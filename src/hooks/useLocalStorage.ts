import { useEffect, useState } from 'react';
export function useLocalStorage<T>(key: string, initial: T, validate: (value: unknown) => T) {
  const [value, setValue] = useState<T>(() => { try { const stored = localStorage.getItem(key); return stored ? validate(JSON.parse(stored)) : initial; } catch { return initial; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable in private sessions. */ } }, [key, value]);
  return [value, setValue] as const;
}
