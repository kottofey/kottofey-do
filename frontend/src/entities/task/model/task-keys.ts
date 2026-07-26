import type { ITaskScopes, ITaskIncludes } from './task-api';

import type { IMeta } from '@/shared/types';

const TASK_QUERY_KEY = 'task' as const;

export const taskKeys = {
  all: [TASK_QUERY_KEY] as const,

  lists: () => [...taskKeys.all, 'list'] as const,

  list: (
    scopes?: ITaskScopes,
    includes?: ITaskIncludes,
    meta?: Partial<IMeta>,
  ): [
    typeof TASK_QUERY_KEY,
    'list',
    { scopes: typeof scopes; includes: typeof includes; meta: typeof meta },
  ] => [...taskKeys.lists(), { scopes, includes, meta }] as const,

  details: () => [...taskKeys.all, 'detail'] as const,

  detail: (id: number) => [...taskKeys.details(), id] as const,
};
