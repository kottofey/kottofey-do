import { Includeable, FindOptions } from 'sequelize';
import { z } from 'zod';

import { TaskRepository } from '../repositories/TaskRepository';

import { BaseService } from '@/shared';
import { TaskModel } from '@/sequelize/models';
import { CommonQuery } from '@/fastify/types';
import { jwtUser } from '@/modules/users/schemas/partials';
import {
  taskCreateSchema,
  taskUpdateSchema,
} from '@/modules/tasks/schemas/partials';

export class TaskService extends BaseService {
  constructor(private taskRepository: TaskRepository) {
    super();
  }

  async getAll({
    page,
    limit,
    scopes,
    currentUser,
    include,
  }: {
    page: number;
    limit: number;
    scopes?: CommonQuery['scopes'];
    currentUser: z.infer<typeof jwtUser>;
    include?: Includeable | Includeable[];
  }) {
    const offset = (page - 1) * limit;

    const where = !this.isAdmin(currentUser.roles)
      ? { owner_id: currentUser.id }
      : {};

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

  async getById({
    id,
    currentUser,
    include,
    otherOptions,
  }: {
    id: number;
    currentUser: z.infer<typeof jwtUser>;
    include?: Includeable | Includeable[];
    otherOptions?: FindOptions<TaskModel>;
  }): Promise<TaskModel | null> {
    const task = await this.taskRepository.findByPk(id, {
      include,
      ...otherOptions,
    });

    if (
      !task ||
      !this.isAllowed({
        currentUserId: currentUser.id,
        currentUserRoles: currentUser.roles,
        recordOwnerId: task.owner_id,
      })
    ) {
      return null;
    }

    return task;
  }

  async create({
    data,
    currentUser,
  }: {
    data: z.infer<typeof taskCreateSchema>;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<TaskModel> {
    return await this.taskRepository.create({
      ...data,
      owner_id: currentUser.id,
    });
  }

  async update({
    id,
    currentUser,
    data,
  }: {
    id: number;
    data: z.infer<typeof taskUpdateSchema>;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<TaskModel | null> {
    const task = await this.getById({ id, currentUser });

    if (!task) return null;

    return await task.update(data);
  }

  async delete({
    id,
    currentUser,
    force,
  }: {
    id: number;
    currentUser: z.infer<typeof jwtUser>;
    force: boolean;
  }): Promise<boolean> {
    const task = await this.getById({
      id,
      currentUser,
      otherOptions: { paranoid: !force },
    });

    if (!task) return false;

    if (force) {
      await task.destroy({ force });
    } else {
      await task.destroy();
    }
    return true;
  }

  async restore({
    id,
    currentUser,
  }: {
    id: number;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<TaskModel | null> {
    const task = await this.taskRepository.findByPkWithParanoid(id, false);

    if (
      !task ||
      !this.isAllowed({
        currentUserId: currentUser.id,
        currentUserRoles: currentUser.roles,
        recordOwnerId: task.owner_id,
      })
    ) {
      return null;
    }

    await task.restore();
    return task;
  }
}
