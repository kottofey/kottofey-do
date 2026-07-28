import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import {
  getAllUsers,
  editUser,
  restoreUser,
  createUser,
  deleteUser,
  getUser,
  type IUserScopes,
  type IUserIncludes,
  type ICreateUserDto,
  type IUpdateUserDto,
  getAllUserRoles,
} from './user-api';
import { userKeys } from './user-keys';

import { createMutationOptions } from '@/shared/lib/tanstack';

export const useUsersQueryClient = async ({
  scopes,
  includes,
  client,
}: {
  scopes?: IUserScopes;
  includes?: IUserIncludes;
  client: QueryClient;
}) => {
  return await client.fetchQuery({
    queryKey: userKeys.list(scopes, includes),
    queryFn: ({ signal }) => getAllUsers({ scopes, includes }, signal),
  });
};

export const useUsersQuery = ({
  scopes,
  includes,
  isEnabled,
}: {
  scopes?: MaybeRefOrGetter<IUserScopes>;
  includes?: IUserIncludes;
  isEnabled?: MaybeRefOrGetter<boolean>;
}) => {
  return useQuery({
    queryKey: computed(() => userKeys.list(toValue(scopes), includes)),
    queryFn: ({ signal }) => getAllUsers({ scopes: toValue(scopes), includes }, signal),
    enabled: computed(() => toValue(isEnabled)),
  });
};

export const useUserQuery = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => getUser({ id }, signal),
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: userKeys.lists(),
    mutationFn: ({ user }: { user: ICreateUserDto }) => createUser({ user }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: () => [userKeys.lists()],
      successMessage: 'Создано',
    }),
  });
};

export const useEditUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updatedUser,
    }: {
      id: number;
      updatedUser: IUpdateUserDto;
    }) => editUser({ id, updatedUser }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: (variables) => [
        userKeys.lists(),
        userKeys.detail(variables.id),
      ],
      successMessage: 'Отредактировано',
    }),
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteUser({ id }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: (variables) => [
        userKeys.lists(),
        userKeys.detail(variables.id),
      ],
      successMessage: 'Удалено',
    }),
  });
};

export const useRestoreUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => restoreUser({ id }),
    ...createMutationOptions({
      queryClient,
      invalidateKeys: (variables) => [
        userKeys.lists(),
        userKeys.detail(variables.id),
      ],
      successMessage: 'Восстановлено',
    }),
  });
};

export const useUserRolesQuery = ({
  isEnabled,
}: {
  isEnabled?: MaybeRefOrGetter<boolean>;
}) => {
  return useQuery({
    queryFn: ({ signal }) => getAllUserRoles(signal),
    queryKey: ['roles'],
    enabled: computed(() => toValue(isEnabled)),
  });
};
