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
}): Promise<{ meta: IMeta; data: IUser[] } | undefined> {
  return await api.get<{ meta: IMeta; data: IUser[] }>('/users', {
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getUser({
  id,
}: {
  id: number;
}): Promise<IUser | undefined> {
  return await api.get<IUser>(`/users/${id}`);
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
}): Promise<IUser | undefined> {
  return await api.post<IUser>('/users', { body: user });
}

export async function deleteUser({ id }: { id: number }): Promise<void> {
  return await api.delete(`/users/${id}`);
}

export async function restoreUser({ id }: { id: number }): Promise<void> {
  return await api.put(`/users/${id}/restore`);
}

export async function editUser({
  id,
  updatedUser,
}: {
  id: number;
  updatedUser: IUpdateUserDto;
}): Promise<IUser | undefined> {
  return await api.put<IUser>(`/users/${id}`, { body: updatedUser });
}

export async function getAllUserRoles(): Promise<IUser['roles']> {
  const rolesData = await api.get<{ data: IUser['roles'] }>('/roles');

  return rolesData?.data ?? [];
}
