import { FindOptions } from 'sequelize';

import { TaskModel } from '@/sequelize/models';
import { BaseRepository } from '@/shared';
import { parseScopes } from '@/fastify/helpers';
import { TASK_SCOPE_HANDLERS } from '@/sequelize/models/Task';
import { CommonQuery } from '@/fastify/types';

export class TaskRepository extends BaseRepository<TaskModel> {
  constructor() {
    super(TaskModel);
  }

  async findAndCountAllWithScopes(
    options: FindOptions,
    scopes?: CommonQuery['scopes'],
  ): Promise<{ rows: TaskModel[]; count: number }> {
    const scopedModel = scopes
      ? this.getScopedModel(parseScopes(scopes, TASK_SCOPE_HANDLERS))
      : this.model;

    return await (scopedModel as typeof TaskModel).findAndCountAll(options);
  }

  async findByPkWithParanoid(
    id: number,
    paranoid = true,
  ): Promise<TaskModel | null> {
    return await this.model.findByPk(id, { paranoid });
  }
}
