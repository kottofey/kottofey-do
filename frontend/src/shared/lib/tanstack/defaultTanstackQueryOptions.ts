import { type VueQueryPluginOptions } from '@tanstack/vue-query';

import { getErrorMessage } from './onError';

import { notification } from '@/shared/lib';

export const defaultTanstackQueryOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      mutations: {
        onError: (error: Error) => {
          notification.error({
            content: getErrorMessage({ error }),
            closable: true,
            duration: 5000,
          });
        },
      },
      queries: {
        retry: false,
      },
    },
  },
};
