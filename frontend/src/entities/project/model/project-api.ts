import { api, serializeQuery } from '@/shared/api';
import type { IUser } from '@/entities/user';
import type { ITask } from '@/entities/task';
import type { IMeta } from '@/shared/types';

export interface IProject {
  id: number;
  name: string;
  owner_id: number;
  is_archived: boolean;

  owner?: Partial<IUser>;
  members?: Partial<IUser>[];
  tasks?: ITask[];

  created_at: number;
  updated_at: number;
  deleted_at: number;
}

export type IProjectScopes = {
  'projects:byOwner'?: number;
};
export type IProjectIncludes = Array<'Owner' | 'Tasks' | 'Members'>;

export async function getAllProjects({
  scopes,
  includes = [],
  meta,
}: {
  scopes?: IProjectScopes;
  includes?: IProjectIncludes;
  meta?: Partial<IMeta>;
}, signal?: AbortSignal): Promise<undefined | { meta: IMeta; data: IProject[] }> {
  return await api.get<{ meta: IMeta; data: IProject[] }>('/projects', {
    query: serializeQuery({ scopes, includes, meta }),
    signal,
  });
}

export async function getProject({
  id,
}: {
  id: number;
}): Promise<IProject | undefined> {
  return await api.get<IProject>(`/projects/${id}`);
}

export interface ICreateProjectDto {
  name: string;
}

export interface IUpdateProjectDto {
  name?: string;
  is_archived?: boolean;
}

export async function createProject({
  project,
}: {
  project: ICreateProjectDto;
}): Promise<IProject | undefined> {
  return await api.post<IProject>('/projects', { body: project });
}

export async function deleteProject({
  id,
  force,
}: {
  id: number;
  force?: boolean;
}): Promise<void> {
  return await api.delete(`/projects/${id}`, {
    params: force ? { force: 'true' } : undefined,
  });
}

export async function restoreProject({ id }: { id: number }): Promise<void> {
  return await api.put(`/projects/${id}/restore`);
}

export async function editProject({
  id,
  updatedProject,
}: {
  id: number;
  updatedProject: IUpdateProjectDto;
}, signal?: AbortSignal): Promise<IProject | undefined> {
  return await api.put<IProject>(`/projects/${id}`, { body: updatedProject, signal });
}
