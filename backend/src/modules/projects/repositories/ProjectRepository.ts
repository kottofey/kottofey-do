import { FindOptions } from 'sequelize';

import { ProjectModel } from '@/sequelize/models';
import { BaseRepository } from '@/shared';
import { parseScopes } from '@/fastify/helpers';
import { TASK_SCOPE_HANDLERS } from '@/sequelize/models/Task';
import { CommonQuery } from '@/fastify/types';

export class ProjectRepository extends BaseRepository<ProjectModel> {
  constructor() {
    super(ProjectModel);
  }

  async findAndCountAllWithScopes(
    options: FindOptions,
    scopes?: CommonQuery['scopes'],
  ): Promise<{ rows: ProjectModel[]; count: number }> {
    const scopedModel = scopes
      ? this.getScopedModel(parseScopes(scopes, TASK_SCOPE_HANDLERS))
      : this.model;

    return await (scopedModel as typeof ProjectModel).findAndCountAll(options);
  }

  async findByPkWithParanoid(
    id: number,
    paranoid = true,
  ): Promise<ProjectModel | null> {
    return await this.model.findByPk(id, { paranoid });
  }
}
