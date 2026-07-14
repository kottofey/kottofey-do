import { ScopeHandler } from '@/sequelize/types';

export const TASK_SCOPE_HANDLERS = {
  // SimpleScope: () => ({ method: ['SimpleScope'] }),
  'tasks:byIds': (rawIds: unknown) => {
    let ids: number[];

    if (typeof rawIds === 'string') {
      ids = rawIds.split(',').map(Number);
    } else if (Array.isArray(rawIds)) {
      ids = rawIds.map(Number);
    } else {
      ids = [Number(rawIds)];
    }

    if (isNaN(ids[0]))
      throw Error('Неверный формат в скоупе byIds. Разделитель запятая.');

    return {
      method: ['tasks:byIds', ids],
    };
  },
  'tasks:byStatus': (statusRaw: unknown) => {
    let status = false;

    if (statusRaw === '1') {
      status = true;
    } else if (statusRaw === '0') {
      status = false;
    } else {
      throw new Error(
        'Неверное значение в скоупе byStatus, может быть 1 или 0',
      );
    }

    return {
      method: ['tasks:byStatus', status],
    };
  },
  'tasks:onlyArchived': () => ({ method: ['tasks:onlyArchived'] }),
  'tasks:onlyDeleted': () => ({ method: ['tasks:onlyDeleted'] }),
  'tasks:noArchived': () => ({ method: ['tasks:noArchived'] }),
  'tasks:byOwner': (ownerId: unknown) => {
    if (isNaN(Number(ownerId))) throw Error('ownerId должен быть числом.');
    return {
      method: ['tasks:byOwner', Number(ownerId)],
    };
  },
  'tasks:byProject': (project_id: unknown) => {
    if (isNaN(Number(project_id)))
      throw Error('project_id должен быть числом.');
    return {
      method: ['tasks:byProject', Number(project_id)],
    };
  },
} as const satisfies Record<string, ScopeHandler>;

export type TaskScopeName = keyof typeof TASK_SCOPE_HANDLERS;
