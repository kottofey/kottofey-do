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
  type ITaskScopes,
  type ITaskIncludes,
  type ICreateTaskDto,
  type IUpdateTaskDto,
} from './task-api';
import { taskKeys } from './task-keys.ts';

import { createMutationOptions } from '@/shared/lib/tanstack';
import { projectKeys } from '@/entities/project/model/project-keys';
import type { IMeta } from '@/shared/types';

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
    mutationFn: ({ task }: { task: ICreateTaskDto }) => createTask({ task }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: () => [taskKeys.lists(), projectKeys.lists()],
    }),
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
      updatedTask: IUpdateTaskDto;
    }) => editTask({ id, updatedTask }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: (variables) => [
        taskKeys.lists(),
        taskKeys.detail(variables.id),
        projectKeys.all,
      ],
    }),
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, force = false }: { id: number; force?: boolean }) =>
      deleteTask({ id, force }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: (variables) => [
        taskKeys.lists(),
        taskKeys.detail(variables.id),
      ],
    }),
  });
};

export const useRestoreTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreTask({ id }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: (variables) => [
        taskKeys.lists(),
        taskKeys.detail(variables.id),
      ],
    }),
  });
};
