import { ScopeHandler } from '@/sequelize/types';

export const USER_SCOPE_HANDLERS = {
  'users:deletedOnly': () => ({ method: ['users:deletedOnly'] }),
} as const satisfies Record<string, ScopeHandler>;

export type UserScopeName = keyof typeof USER_SCOPE_HANDLERS;
