import { useLocalStorage } from '@vueuse/core';

interface ISettings {
  theme: 'light' | 'dark';
}

export default function useSettings() {
  const settings = useLocalStorage<ISettings>(
    'settings',
    {
      theme: 'light',
    },
    {
      deep: true,
    },
  );

  return { settings };
}
