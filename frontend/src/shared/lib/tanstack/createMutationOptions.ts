import { type QueryClient, type QueryKey } from '@tanstack/vue-query';

import { notification } from '@/shared/lib';

export function createMutationOptions<TVariables>({
  queryClient,
  invalidateKeys,
  successMessage,
}: {
  queryClient: QueryClient;
  invalidateKeys: (variables: TVariables) => QueryKey[];
  successMessage?: string;
}) {
  return {
    onSuccess: async (_data: unknown, variables: TVariables) => {
      const keys = invalidateKeys(variables);
      for (const key of keys) {
        await queryClient.invalidateQueries({ queryKey: key });
      }
      if (successMessage) {
        notification.success({
          content: successMessage,
          closable: true,
          duration: 5000,
        });
      }
    },
  };
}
