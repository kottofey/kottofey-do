import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import {
  getAllTasks,
  editTask,
  restoreTask,
  createTask,
  deleteTask,
  getTask,
  type ITask,
  type ITaskScopes,
  type ITaskIncludes,
} from './task-api';
import { taskKeys } from './task-keys.ts';

import { notification } from '@/shared/lib';
import { getErrorMessage } from '@/shared/lib/tanstack';

export const useTaskQueryClient = async ({
  client,
  scopes,
  includes,
}: {
  client: QueryClient;
  scopes?: ITaskScopes;
  includes?: ITaskIncludes;
}) => {
  // Для разовых запросов
  return await client.fetchQuery({
    queryKey: taskKeys.list(scopes, includes),
    queryFn: () => getAllTasks({ scopes, includes }),
  });
};

export const useTasksQueryClient = async ({
  scopes,
  includes,
  client,
}: {
  scopes?: ITaskScopes;
  includes?: ITaskIncludes;
  client: QueryClient;
}) => {
  return await client.fetchQuery({
    queryKey: taskKeys.list(scopes, includes),
    queryFn: () => getAllTasks({ scopes, includes }),
  });
};

export const useTasksQuery = ({
  scopes,
  includes,
  isEnabled,
}: {
  scopes?: MaybeRefOrGetter<ITaskScopes>;
  includes?: ITaskIncludes;
  isEnabled?: MaybeRefOrGetter<boolean>;
}) => {
  return useQuery({
    queryKey: computed(() => taskKeys.list(toValue(scopes), includes)),
    queryFn: () => getAllTasks({ scopes: toValue(scopes), includes }),
    enabled: computed(() => toValue(isEnabled)),
  });
};

export const useTaskQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask({ id }),
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: taskKeys.lists(),
    mutationFn: ({ task }: { task: Partial<ITask> }) => createTask({ task }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    onError: (error: Error) => {
      notification.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};

export const useEditTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updatedTask,
    }: {
      id: number;
      updatedTask: Partial<ITask>;
    }) => editTask({ id, updatedTask }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id),
      });
      // notification.success({
      //   content: 'Отредактировано',
      //   closable: true,
      //   duration: 5000,
      // });
    },
    onError: (error: Error) => {
      notification.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteTask({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id),
      });
      // notification.success({
      //   content: 'Удалено',
      //   closable: true,
      //   duration: 5000,
      // });
    },
    onError: (error: Error) => {
      notification.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};

export const useRestoreTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreTask({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id),
      });
      // notification.success({
      //   content: 'Восстановлено',
      //   closable: true,
      //   duration: 5000,
      // });
    },
    onError: (error: Error) => {
      notification.error({
        content: getErrorMessage({ error }),
        closable: true,
        duration: 5000,
      });
    },
  });
};
