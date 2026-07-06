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
  // {
  //   path: '/drugstores',
  //   name: 'drugstores.show',
  //   component: () => import('@/pages/drugstores'),
  //   meta: {},
  // },
  // {
  //   path: '/doctors',
  //   name: 'doctors.show',
  //   component: () => import('@/pages/doctors'),
  //   meta: {},
  // },
  // {
  //   path: '/clients',
  //   name: 'clients.show',
  //   component: () => import('@/pages/clients'),
  //   meta: {},
  // },
  // {
  //   path: '/staging-changes',
  //   name: 'staging-changes.show',
  //   component: () => import('@/pages/staging-changes'),
  //   meta: {},
  // },
  {
    path: '/login',
    name: 'login.show',
    component: () => import('@/pages/login'),
  },
];

export default routes;
