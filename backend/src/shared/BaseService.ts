import { z } from 'zod';

import { roleSchema } from '@/modules/users/schemas/partials/userBaseSchema.js';

export abstract class BaseService {
  protected paginate(count: number, limit: number, page: number) {
    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  isAdmin(roles: z.infer<typeof roleSchema>[]) {
    // TODO внедрить константу для названий ролей, чтобы не хардкодить
    return roles.some(r => r.name === 'admin');
  }

  /**
   * Разрешено, если админ или владелец сущности
   * @param recordOwnerId ID владельца сущности
   * @param currentUserId ID запрашивающего юзера
   * @param currentUserRoles Массив ролей запрашивающего юзера
   */
  isAllowed({
    recordOwnerId,
    currentUserId,
    currentUserRoles,
  }: {
    recordOwnerId: number;
    currentUserId: number;
    currentUserRoles: z.infer<typeof roleSchema>[];
  }) {
    return this.isAdmin(currentUserRoles) || recordOwnerId === currentUserId;
  }
}
