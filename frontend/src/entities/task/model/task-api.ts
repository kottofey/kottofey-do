import { api, serializeQuery } from '@/shared/api';
import type { IUser } from '@/entities/user';
import type { IMeta } from '@/shared/types';
import type { IProject } from '@/entities/project';

export interface ITask {
  id: number;
  project_id: number | null;
  owner_id: number;
  title: string;
  body: string;
  priority: 'high' | 'normal' | 'low';
  sort_order: number;
  is_done: boolean;
  is_archived: boolean;

  project: IProject;
  owner?: Partial<IUser>;

  created_at: number;
  updated_at: number;
  deleted_at: number;
}

export type ITaskScopes = {
  'tasks:byIds'?: number[];
  'tasks:byOwner'?: number;
  'tasks:byProject'?: number;
  'tasks:byStatus'?: boolean;
  'tasks:onlyArchived'?: boolean;
  'tasks:onlyDeleted'?: boolean;
  'tasks:noArchived'?: boolean;
};
export type ITaskIncludes = Array<'Owner' | 'Project'>;

export async function getAllTasks({
  scopes,
  includes = [],
  meta,
}: {
  scopes?: ITaskScopes;
  includes?: ITaskIncludes;
  meta?: Partial<IMeta>;
}, signal?: AbortSignal): Promise<undefined | { meta: IMeta; data: ITask[] }> {
  return await api.get<{ meta: IMeta; data: ITask[] }>('/tasks', {
    query: serializeQuery({ scopes, includes, meta }),
    signal,
  });
}

export async function getTask({
  id,
}: {
  id: number;
}, signal?: AbortSignal): Promise<ITask | undefined> {
  return await api.get<ITask>(`/tasks/${id}`, { signal });
}

export interface ICreateTaskDto {
  title: string;
  project_id?: number | null;
}

export interface IUpdateTaskDto {
  title?: string;
  body?: string;
  is_done?: boolean;
  is_archived?: boolean;
  priority?: 'high' | 'normal' | 'low';
  project_id?: number | null;
}

export async function createTask({
  task,
}: {
  task: ICreateTaskDto;
}, signal?: AbortSignal): Promise<ITask | undefined> {
  return await api.post<ITask>('/tasks', { body: task, signal });
}

export async function deleteTask({
  id,
  force,
}: {
  id: number;
  force?: boolean;
}, signal?: AbortSignal): Promise<void> {
  return await api.delete(`/tasks/${id}`, {
    params: force ? { force: 'true' } : undefined,
    signal,
  });
}

export async function restoreTask({ id }: { id: number }, signal?: AbortSignal): Promise<void> {
  return await api.put(`/tasks/${id}/restore`, { signal });
}

export async function editTask({
  id,
  updatedTask,
}: {
  id: number;
  updatedTask: IUpdateTaskDto;
}, signal?: AbortSignal): Promise<ITask | undefined> {
  return await api.put<ITask>(`/tasks/${id}`, { body: updatedTask, signal });
}
