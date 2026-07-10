import { useApi, httpMethod, serializeQuery } from '@/shared/api';
import type { IUser } from '@/entities/user';
import type { IMeta } from '@/shared/types';

// TODO дописать скоупы если будут
// TODO написать алгоритм сериализации с проверкой через zod
export interface ITask {
  id: number;
  project_id: number;
  owner_id: number;
  title: string;
  priority: 'high' | 'normal' | 'low';
  sort_order: number;
  is_done: boolean;
  is_archived: boolean;

  project: object;
  owner: Partial<IUser>;

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
}: {
  scopes?: ITaskScopes;
  includes?: ITaskIncludes;
}): Promise<undefined | { meta: IMeta; data: ITask[] }> {
  return await useApi<{ meta: IMeta; data: ITask[] }>({
    route: 'tasks',
    method: httpMethod.GET,
    query: serializeQuery({ scopes, includes }),
  });
}

export async function getTask({
  id,
}: {
  id: number;
}): Promise<ITask | undefined> {
  return await useApi<ITask>({
    route: `tasks/${id}`,
    method: httpMethod.GET,
  });
}

export async function createTask({
  task,
}: {
  task: Partial<ITask>;
}): Promise<ITask | undefined> {
  return await useApi<ITask>({
    route: `tasks`,
    method: httpMethod.POST,
    body: JSON.stringify(task),
  });
}

export async function deleteTask({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `tasks/${id}`,
    method: httpMethod.DELETE,
  });
}

export async function restoreTask({ id }: { id: number }): Promise<void> {
  return await useApi({
    route: `tasks/${id}/restore`,
    method: httpMethod.PUT,
  });
}

export async function editTask({
  id,
  updatedTask,
}: {
  id: number;
  updatedTask: Partial<ITask>;
}): Promise<ITask | undefined> {
  return await useApi<ITask>({
    route: `tasks/${id}`,
    method: httpMethod.PUT,
    body: JSON.stringify(updatedTask),
  });
}
