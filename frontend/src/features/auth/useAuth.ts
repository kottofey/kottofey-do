import { useApi, httpMethod } from '@/shared/api';
import { router } from '@/app/router';
import { useAuthStore } from '@/shared/stores';
import type { IUser } from '@/entities/user';
import { notification } from '@/shared/lib';

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
      const result = await useApi<IAuthResponse>({
        route: 'users/login',
        method: httpMethod.POST,
        body: JSON.stringify({ email, password }),
      });

      if (result?.user) {
        authStore.setUser(result.user);
        await router.push({ name: 'home.show' });
      }
    } catch (e) {
      if (e instanceof Error) {
        notification.error({
          content: e.message,
          closable: true,
          duration: 5000,
        });
      } else {
        notification.error({
          content: 'Ошибка! Подробности в консоли!',
          closable: true,
          duration: 5000,
        });
        console.error(e);
      }
    }
  };

  const logout = async () => {
    try {
      await useApi<IAuthResponse>({
        route: 'users/logout',
        method: httpMethod.DELETE,
      });
    } catch (e) {
      console.error(e);
    } finally {
      authStore.deleteUser();
      router.push({ name: 'login.show' });
    }
  };

  const initializeAuthState = async () => {
    const authStore = useAuthStore();
    try {
      const me = await useApi<Partial<IUser>>({
        route: 'users/me',
        method: httpMethod.GET,
      });

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
