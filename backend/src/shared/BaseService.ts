export abstract class BaseService {
  protected paginate(count: number, limit: number, page: number) {
    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  isAdmin(roles: string[]) {
    // TODO внедрить константу для названий ролей, чтобы не хардкодить
    return roles.some(r => r === 'admin');
  }

  isAllowed(recordOwnerId: number, currentUserId: number, currentUserRoles: string[]) {
    return this.isAdmin(currentUserRoles) || recordOwnerId === currentUserId;
  }
}
