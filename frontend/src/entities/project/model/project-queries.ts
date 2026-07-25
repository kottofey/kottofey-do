import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import {
  getAllProjects,
  editProject,
  restoreProject,
  createProject,
  deleteProject,
  getProject,
  type IProject,
  type IProjectScopes,
  type IProjectIncludes,
} from './project-api';
import { projectKeys } from './project-keys.ts';

import { notification } from '@/shared/lib';
import { getErrorMessage } from '@/shared/lib/tanstack';
import type { IMeta } from '@/shared/types';

export const useProjectsQuery = ({
  scopes,
  includes,
  meta,
  isEnabled,
}: {
  scopes?: MaybeRefOrGetter<IProjectScopes>;
  includes?: IProjectIncludes;
  meta?: MaybeRefOrGetter<Partial<IMeta>>;
  isEnabled?: MaybeRefOrGetter<boolean>;
}) => {
  return useQuery({
    queryKey: computed(() =>
      projectKeys.list(toValue(scopes), includes, toValue(meta)),
    ),
    queryFn: () =>
      getAllProjects({
        scopes: toValue(scopes),
        includes,
        meta: toValue(meta),
      }),
    enabled: computed(() => toValue(isEnabled)),
  });
};

export const useProjectQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject({ id }),
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectKeys.lists(),
    mutationFn: ({ project }: { project: Partial<IProject> }) =>
      createProject({ project }),
    onSuccess: async () => {
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

export const useEditProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updatedProject,
    }: {
      id: number;
      updatedProject: Partial<IProject>;
    }) => editProject({ id, updatedProject }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id),
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

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, force = false }: { id: number; force?: boolean }) =>
      deleteProject({ id, force }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id),
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

export const useRestoreProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreProject({ id }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id),
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
