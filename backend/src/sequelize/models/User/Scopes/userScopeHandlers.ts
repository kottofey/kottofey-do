import { ScopeHandler } from '@/sequelize/types';

export const USER_SCOPE_HANDLERS = {
  isAdmin: () => {
    return {
      method: ['isAdmin'],
    };
  },
} as const satisfies Record<string, ScopeHandler>;

export type UserScopeName = keyof typeof USER_SCOPE_HANDLERS;
