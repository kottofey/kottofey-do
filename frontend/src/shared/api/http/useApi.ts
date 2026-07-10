import { router } from '@/app/router';
import { notification } from '@/shared/lib';
import { useAuthStore } from '@/shared/stores';

export default async function useApi<T>({
  route,
  query,
  method,
  body,
}: {
  route: string;
  query?: string;
  method?: string;
  body?: string;
}) {
  const { VITE_API_BASE_URL, VITE_API_PORT, MODE, VITE_API_VERSION } =
    import.meta.env;

  // const { clearAuthState } = useAuth();
  const parsedQuery = query ? '?' + query : '';

  const headers = new Headers();

  if (body) {
    headers.set('Content-Type', 'application/json');
  }

  const resp = await fetch(
    MODE === 'development'
      ? `/api/${VITE_API_VERSION}/${route}${parsedQuery}`
      : `${VITE_API_BASE_URL}${VITE_API_PORT ? ':' + VITE_API_PORT : ''}/api/${VITE_API_VERSION}/${route}${parsedQuery}`,
    {
      mode: 'cors',
      credentials: 'include',
      method,
      body,
      headers,
    },
  );

  if (!resp.ok) {
    const err_response = await resp
      .json()
      .catch(() => ({ json: 'not a json in a response' }));

    notification.error({
      content: err_response.message,
      duration: 1500,
      closable: true,
    });

    if (resp.status === 401) {
      const authStore = useAuthStore();
      authStore.deleteUser();

      router.push({ name: 'login.show' });
    }

    return;
  }

  const json = await resp.json();

  if (json.message) {
    notification.info({
      content: json.message,
      duration: 1500,
      closable: true,
    });
  }

  return json as T;
}
