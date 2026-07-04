import { ScopeHandler } from '@/sequelize/types';

export const PROJECT_MEMBER_SCOPE_HANDLERS = {
  byUser: (userId: unknown) => {
    if (isNaN(Number(userId))) throw Error('userId должен быть числом.');

    return {
      method: ['byUser', Number(userId)],
    };
  },
  byProject: (projectId: unknown) => {
    if (isNaN(Number(projectId))) throw Error('projectId должен быть числом.');

    return {
      method: ['byProject', Number(projectId)],
    };
  },
} as const satisfies Record<string, ScopeHandler>;

export type ProjectMembersScopeName = keyof typeof PROJECT_MEMBER_SCOPE_HANDLERS;
