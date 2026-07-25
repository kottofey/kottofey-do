import { createRouter, createWebHistory } from 'vue-router';

import routes from './routes';

import { useAuthStore } from '@/shared/stores';

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'link--active',
  linkExactActiveClass: 'link--active',
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.name === 'login.show' && (authStore.user || authStore.isLoggingIn)) {
    return { name: 'home.show' };
  }

  if (to.name !== 'login.show' && !authStore.user && !authStore.isLoggingIn) {
    return { name: 'login.show' };
  }
});

export default router;
