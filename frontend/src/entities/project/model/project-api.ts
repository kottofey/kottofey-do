import { useApi, httpMethod, serializeQuery } from '@/shared/api';
import type { IUser } from '@/entities/user';
import type { ITask } from '@/entities/task';
import type { IMeta } from '@/shared/types';

// TODO дописать скоупы если будут
// TODO написать алгоритм сериализации с проверкой через zod
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
}): Promise<undefined | { meta: IMeta; data: IProject[] }> {
  return await useApi<{ meta: IMeta; data: IProject[] }>({
    route: `projects`,
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes, meta }),
  });
}

export async function getProject({
  id,
}: {
  id: number;
}): Promise<IProject | undefined> {
  return await useApi<IProject>({
    route: `projects/${id}`,
    method: httpMethod.GET,
  });
}

export async function createProject({
  project,
}: {
  project: Partial<IProject>;
}): Promise<IProject | undefined> {
  return await useApi<IProject>({
    route: `projects`,
    method: httpMethod.POST,
    body: JSON.stringify(project),
  });
}

export async function deleteProject({
  id,
  force,
}: {
  id: number;
  force?: boolean;
}): Promise<void> {
  return await useApi({
    route: `projects/${id}${force ? '?force=true' : ''}`,
    method: httpMethod.DELETE,
  });
}

export async function restoreProject({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `projects/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editProject({
  id,
  updatedProject,
}: {
  id: number;
  updatedProject: Partial<IProject>;
}): Promise<IProject | undefined> {
  return await useApi<IProject>({
    route: `projects/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedProject),
  });
}
