import { Attributes, CreationAttributes, WhereOptions, Includeable, FindOptions } from 'sequelize';

import { TaskRepository } from '../repositories/TaskRepository';

import { BaseService } from '@/shared';
import { TaskModel } from '@/sequelize/models';
import { CommonQuery } from '@/fastify/types';

export class TaskService extends BaseService {
  constructor(private taskRepository: TaskRepository) {
    super();
  }

  async getAll(params: {
    page: number;
    limit: number;
    scopes?: CommonQuery['scopes'];
    userId: number;
    isAdmin: boolean;
    include?: Includeable | Includeable[];
  }) {
    const { page, limit, scopes, userId, isAdmin, include } = params;
    const offset = (page - 1) * limit;

    const where: WhereOptions = !isAdmin ? { owner_id: userId } : {};

    const { rows, count } = await this.taskRepository.findAndCountAllWithScopes(
      {
        where,
        limit,
        offset,
        include,
        distinct: true,
      } as FindOptions,
      scopes,
    );

    return {
      data: rows,
      meta: this.paginate(count, limit, page),
    };
  }

  async getById(
    id: number,
    userId: number,
    isAdmin: boolean,
    include?: Includeable | Includeable[],
  ): Promise<TaskModel | null> {
    const task = await this.taskRepository.findByPk(id, { include });

    if (!task) return null;
    if (!isAdmin && task.owner_id !== userId) return null;

    return task;
  }

  async create(data: CreationAttributes<TaskModel>): Promise<TaskModel> {
    return await this.taskRepository.create(data);
  }

  async update(
    id: number,
    data: Partial<Attributes<TaskModel>>,
    userId: number,
    isAdmin: boolean,
  ): Promise<TaskModel | null> {
    const task = await this.getById(id, userId, isAdmin);
    if (!task) return null;

    return await task.update(data);
  }

  async delete(id: number, userId: number, isAdmin: boolean): Promise<boolean> {
    const task = await this.getById(id, userId, isAdmin);
    if (!task) return false;

    await task.destroy();
    return true;
  }

  async restore(id: number, userId: number, isAdmin: boolean): Promise<TaskModel | null> {
    const task = await this.taskRepository.findByPkWithParanoid(id, false);
    if (!task) return null;
    if (!isAdmin && task.owner_id !== userId) return null;

    await task.restore();
    return task;
  }
}
