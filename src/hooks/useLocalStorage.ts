import { useState, useEffect } from "react";


const prefix = "Wordoodle_";
export function useLocalStorage<T>(key: string, defaultValue: string) : [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue as T;
    const saved = window.localStorage.getItem(prefix+key);
    if (saved) {
      return JSON.parse(saved) as T;
    }
    return defaultValue as T;
  });

  useEffect(() => {
    window.localStorage.setItem(prefix+key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};