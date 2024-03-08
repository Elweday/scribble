import {useState, useEffect} from 'react'
export function useLocalStorage<T>( key: string, initialValue: T) {
    const [state, setState] = useState<T | null>(() => {
    const json = localStorage.getItem(key);
    if (json != null) return JSON.parse(json);
    return initialValue;
  });

  useEffect(() => {
    if (state === null) return;
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}