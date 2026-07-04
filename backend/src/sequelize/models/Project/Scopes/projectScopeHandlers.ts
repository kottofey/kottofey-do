import { ScopeHandler } from '@/sequelize/types';

export const PROJECT_SCOPE_HANDLERS = {
  byOwner: (ownerId: unknown) => {
    if (isNaN(Number(ownerId))) throw Error('ownerId должен быть числом.');

    return {
      method: ['byOwner', Number(ownerId)],
    };
  },
  byProject: (projectId: unknown) => {
    if (isNaN(Number(projectId))) throw Error('projectId должен быть числом.');

    return {
      method: ['byProject', Number(projectId)],
    };
  },
} as const satisfies Record<string, ScopeHandler>;

export type ProjectScopeName = keyof typeof PROJECT_SCOPE_HANDLERS;
