import { api, serializeQuery } from '@/shared/api';
import type { IMeta } from '@/shared/types';

export interface IUser {
  id: number;

  // surname: string;
  // firstname: string;
  // patronymic: string;

  email: string;
  password: string;

  roles: {
    id?: number;
    name: string;
    description?: string;
  }[];

  deleted_at: number;
}

export type IUserScopes = {
  'users:deletedOnly'?: boolean;
};
export type IUserIncludes = Array<''>;

export async function getAllUsers({
  scopes,
  includes = [],
}: {
  scopes?: IUserScopes;
  includes?: IUserIncludes;
}, signal?: AbortSignal): Promise<{ meta: IMeta; data: IUser[] } | undefined> {
  return await api.get<{ meta: IMeta; data: IUser[] }>('/users', {
    query: serializeQuery({ scopes, includes }),
    signal,
  });
}

export async function getUser({
  id,
}: {
  id: number;
}, signal?: AbortSignal): Promise<IUser | undefined> {
  return await api.get<IUser>(`/users/${id}`, { signal });
}

export interface ICreateUserDto {
  email: string;
  password: string;
  roles: { name: string; description?: string }[];
}

export interface IUpdateUserDto {
  email?: string;
  password?: string;
  roles?: { name: string; description?: string }[];
}

export async function createUser({
  user,
}: {
  user: ICreateUserDto;
}, signal?: AbortSignal): Promise<IUser | undefined> {
  return await api.post<IUser>('/users', { body: user, signal });
}

export async function deleteUser({ id }: { id: number }, signal?: AbortSignal): Promise<void> {
  return await api.delete(`/users/${id}`, { signal });
}

export async function restoreUser({ id }: { id: number }, signal?: AbortSignal): Promise<void> {
  return await api.put(`/users/${id}/restore`, { signal });
}

export async function editUser({
  id,
  updatedUser,
}: {
  id: number;
  updatedUser: IUpdateUserDto;
}, signal?: AbortSignal): Promise<IUser | undefined> {
  return await api.put<IUser>(`/users/${id}`, { body: updatedUser, signal });
}

export async function getAllUserRoles(signal?: AbortSignal): Promise<IUser['roles']> {
  const rolesData = await api.get<{ data: IUser['roles'] }>('/roles', { signal });

  return rolesData?.data ?? [];
}
