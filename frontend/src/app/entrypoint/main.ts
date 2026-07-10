import { createApp } from 'vue';
import '@/app/styles/reset.scss';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';

import App from './App.vue';

import { router } from '@/app/router';
import { useAuth } from '@/features/auth';
import { defaultTanstackQueryOptions } from '@/shared/lib/tanstack';

const app = createApp(App);
const pinia = createPinia();

// Инициализировать authStore надо ДО использования роутера, который его использует
app.use(pinia);
await useAuth().initializeAuthState();
app.use(router);
app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
  ...defaultTanstackQueryOptions,
});

app.mount('#app');
