import { ScopeOptions } from 'sequelize';

export type ScopeHandler = (
  value: unknown,
) => ScopeOptions | ScopeOptions[] | undefined;
