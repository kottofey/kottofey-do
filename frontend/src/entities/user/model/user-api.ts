import { useApi, httpMethod, serializeQuery } from '@/shared/api';

// TODO дописать скоупы если будут
// TODO написать алгоритм сериализации с проверкой через zod
export interface IUser {
  id: number;

  // surname: string;
  // firstname: string;
  // patronymic: string;

  email: string;

  roles: string[];

  deleted_at: number;
}

export type IUserScopes = {
  'users:activeOnly'?: boolean; // TODO доделать
};
export type IUserIncludes = Array<''>;

export async function getAllUsers({
  scopes,
  includes = [],
}: {
  scopes?: IUserScopes;
  includes?: IUserIncludes;
}): Promise<IUser[] | undefined> {
  return await useApi<IUser[]>({
    route: 'users',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getUser({
  id,
}: {
  id: number;
}): Promise<IUser | undefined> {
  return await useApi<IUser>({
    route: `users/${id}`,
    method: httpMethod.GET,
  });
}

export async function createUser({
  user,
}: {
  user: Partial<IUser>;
}): Promise<IUser | undefined> {
  return await useApi<IUser>({
    route: `users`,
    method: httpMethod.POST,
    body: JSON.stringify(user),
  });
}

export async function deleteUser({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `users/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restoreUser({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `users/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editUser({
  id,
  updatedUser,
}: {
  id: number;
  updatedUser: Partial<IUser>;
}): Promise<IUser | undefined> {
  return await useApi<IUser>({
    route: `users/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedUser),
  });
}
