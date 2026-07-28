import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import {
  getAllProjects,
  editProject,
  restoreProject,
  createProject,
  deleteProject,
  getProject,
  type IProjectScopes,
  type IProjectIncludes,
  type ICreateProjectDto,
  type IUpdateProjectDto,
} from './project-api';
import { projectKeys } from './project-keys.ts';

import { createMutationOptions } from '@/shared/lib/tanstack';
import type { IMeta } from '@/shared/types';

export const useProjectsQueryClient = async ({
  scopes,
  includes,
  meta,
  client,
}: {
  client: QueryClient;
  scopes?: IProjectScopes;
  meta?: Partial<IMeta>;
  includes?: IProjectIncludes;
}) => {
  // Для разовых запросов
  return await client.fetchQuery({
    queryKey: projectKeys.list(scopes, includes, meta),
    queryFn: ({ signal }) => getAllProjects({ includes, scopes, meta }, signal),
  });
};

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
    queryFn: ({ signal }) =>
      getAllProjects({
        scopes: toValue(scopes),
        includes,
        meta: toValue(meta),
      }, signal),
    enabled: computed(() => toValue(isEnabled)),
  });
};

export const useProjectQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: ({ signal }) => getProject({ id }, signal),
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: projectKeys.lists(),
    mutationFn: ({ project }: { project: ICreateProjectDto }) =>
      createProject({ project }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: () => [projectKeys.lists()],
    }),
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
      updatedProject: IUpdateProjectDto;
    }) => editProject({ id, updatedProject }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: (variables) => [
        projectKeys.lists(),
        projectKeys.detail(variables.id),
      ],
    }),
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, force = false }: { id: number; force?: boolean }) =>
      deleteProject({ id, force }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: (variables) => [
        projectKeys.lists(),
        projectKeys.detail(variables.id),
      ],
    }),
  });
};

export const useRestoreProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreProject({ id }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: (variables) => [
        projectKeys.lists(),
        projectKeys.detail(variables.id),
      ],
    }),
  });
};
