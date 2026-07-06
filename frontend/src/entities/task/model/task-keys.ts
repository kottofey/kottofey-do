const TASK_QUERY_KEY = 'task' as const;
import type { ITaskScopes, ITaskIncludes } from './task-api';

export const taskKeys = {
  all: [TASK_QUERY_KEY] as const,

  lists: () => [...taskKeys.all, 'list'] as const,

  list: (
    scopes?: ITaskScopes,
    includes?: ITaskIncludes,
  ): [
    typeof TASK_QUERY_KEY,
    'list',
    { scopes: typeof scopes; includes: typeof includes },
  ] => [...taskKeys.lists(), { scopes, includes }] as const,

  details: () => [...taskKeys.all, 'detail'] as const,

  detail: (id: number) => [...taskKeys.details(), id] as const,
};
