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
  if (useAuthStore().user && to.name === 'login.show') {
    return { name: 'home.show' };
  }

  if (to.name !== 'login.show' && !useAuthStore().user) {
    // console.error('Route guard: user is not authorized');
    return { name: 'login.show' };
  }
});

export default router;
