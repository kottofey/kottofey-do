import { api, ApiError } from '@/shared/api';
import { router } from '@/app/router';
import { useAuthStore } from '@/shared/stores';
import { notification } from '@/shared/lib';
import type { IUser } from '@/entities/user';

export interface IAuthResponse {
  message: string;
  user: Partial<IUser>;
}

export default function useAuth() {
  const authStore = useAuthStore();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      authStore.setLoggingIn(true);
      const result = await api.post<IAuthResponse>('/users/login', {
        body: { email, password },
      });

      if (result?.user) {
        authStore.setUser(result.user);
        await router.push({ name: 'home.show' });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        notification.error({
          content: error.message,
          closable: true,
          duration: 5000,
        });
      }
    } finally {
      authStore.setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await api.delete('/users/logout');
    } finally {
      authStore.deleteUser();
      await router.push({ name: 'login.show' });
    }
  };

  const initializeAuthState = async () => {
    const authStore = useAuthStore();
    try {
      const me = await api.get<Partial<IUser>>('/users/me');

      if (me) {
        authStore.setUser(me);
      } else {
        authStore.deleteUser();
      }
    } catch {
      authStore.deleteUser();
    }
  };

  return { login, logout, initializeAuthState };
}
