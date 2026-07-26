import type { IProjectScopes, IProjectIncludes } from './project-api';

import type { IMeta } from '@/shared/types';

const PROJECT_QUERY_KEY = 'project' as const;

export const projectKeys = {
  all: [PROJECT_QUERY_KEY] as const,

  lists: () => [...projectKeys.all, 'list'] as const,

  list: (
    scopes?: IProjectScopes,
    includes?: IProjectIncludes,
    meta?: Partial<IMeta>,
  ): [
    typeof PROJECT_QUERY_KEY,
    'list',
    { scopes: typeof scopes; includes: typeof includes; meta: typeof meta },
  ] => [...projectKeys.lists(), { scopes, includes, meta }] as const,

  details: () => [...projectKeys.all, 'detail'] as const,

  detail: (id: number) => [...projectKeys.details(), id] as const,
};
