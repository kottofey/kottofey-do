import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home.show',
    component: () => import('@/pages/home'),
    meta: {},
  },
  {
    path: '/tasks',
    name: 'tasks.show',
    component: () => import('@/pages/tasks'),
    meta: {},
  },

  {
    path: '/login',
    name: 'login.show',
    component: () => import('@/pages/login'),
  },
  {
    path: '/users',
    name: 'users.show',
    component: () => import('@/pages/users'),
    meta: {},
  },
];

export default routes;
