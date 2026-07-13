import { FindOptions } from 'sequelize';

import { ProjectMembersModel } from '@/sequelize/models';
import { BaseRepository } from '@/shared';
import { parseScopes } from '@/fastify/helpers';
import { TASK_SCOPE_HANDLERS } from '@/sequelize/models/Task';
import { CommonQuery } from '@/fastify/types';

export class ProjectMemberRepository extends BaseRepository<ProjectMembersModel> {
  constructor() {
    super(ProjectMembersModel);
  }

  async findAndCountAllWithScopes(
    options: FindOptions,
    scopes?: CommonQuery['scopes'],
  ): Promise<{ rows: ProjectMembersModel[]; count: number }> {
    const scopedModel = scopes
      ? this.getScopedModel(parseScopes(scopes, TASK_SCOPE_HANDLERS))
      : this.model;

    return await (scopedModel as typeof ProjectMembersModel).findAndCountAll(options);
  }

  async findByPkWithParanoid(id: number, paranoid = true): Promise<ProjectMembersModel | null> {
    return await this.model.findByPk(id, { paranoid });
  }

  async findMember(project_id: number, user_id: number): Promise<ProjectMembersModel | null> {
    return await this.model.findOne({
      where: { project_id, user_id },
    });
  }
}
