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

import { projectKeys } from '@/entities/project/model/project-keys';
import { notification } from '@/shared/lib';
import { getErrorMessage } from '@/shared/lib/tanstack';
import type { IMeta } from '@/shared/types';

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
  meta,
  client,
}: {
  scopes?: ITaskScopes;
  includes?: ITaskIncludes;
  meta?: MaybeRefOrGetter<Partial<IMeta>>;
  client: QueryClient;
}) => {
  return await client.fetchQuery({
    queryKey: taskKeys.list(scopes, includes, toValue(meta)),
    queryFn: () => getAllTasks({ scopes, includes, meta: toValue(meta) }),
  });
};

export const useTasksQuery = ({
  scopes,
  includes,
  meta,
  isEnabled,
}: {
  scopes?: MaybeRefOrGetter<ITaskScopes>;
  includes?: ITaskIncludes;
  meta?: MaybeRefOrGetter<Partial<IMeta>>;
  isEnabled?: MaybeRefOrGetter<boolean>;
}) => {
  return useQuery({
    queryKey: computed(() =>
      taskKeys.list(toValue(scopes), includes, toValue(meta)),
    ),
    queryFn: () =>
      getAllTasks({ scopes: toValue(scopes), includes, meta: toValue(meta) }),
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
      await queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
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
      await queryClient.invalidateQueries({ queryKey: projectKeys.all });
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
    mutationFn: ({ id, force = false }: { id: number; force?: boolean }) =>
      deleteTask({ id, force }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id),
      });
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
