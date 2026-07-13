export abstract class BaseService {
  protected paginate(count: number, limit: number, page: number) {
    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
