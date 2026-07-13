import {
  Attributes,
  CreationAttributes,
  WhereOptions,
  Op,
  Includeable,
  FindOptions,
} from 'sequelize';

import { ProjectRepository } from '../repositories/ProjectRepository';

import { BaseService } from '@/shared';
import { ProjectModel } from '@/sequelize/models';
import { CommonQuery } from '@/fastify/types';

export class ProjectService extends BaseService {
  constructor(private projectRepository: ProjectRepository) {
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

    let projectIds: number[] | null = null;

    if (!isAdmin) {
      const ownedProjects = await ProjectModel.findAll({
        attributes: ['id'],
        where: { owner_id: userId },
      });

      const memberProjects = await ProjectModel.findAll({
        attributes: ['id'],
        include: [{ association: 'members', attributes: [], required: true }],
        where: { '$members.id$': userId },
      });

      const allIds = [...ownedProjects.map(p => p.id), ...memberProjects.map(p => p.id)];
      projectIds = [...new Set(allIds)];

      if (projectIds.length === 0) {
        return {
          data: [],
          meta: this.paginate(0, limit, page),
        };
      }
    }

    const where: WhereOptions = projectIds ? { id: { [Op.in]: projectIds } } : {};

    const { rows, count } = await this.projectRepository.findAndCountAllWithScopes(
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
  ): Promise<ProjectModel | null> {
    const project = await this.projectRepository.findByPk(id, { include });

    if (!project) return null;

    if (!isAdmin) {
      // Проверяем владение или участие
      const isOwner = project.owner_id === userId;
      const isMember = await ProjectModel.findOne({
        where: { id },
        include: [
          { association: 'members', attributes: [], required: true, where: { id: userId } },
        ],
      });

      if (!isOwner && !isMember) return null;
    }

    return project;
  }

  async create(data: CreationAttributes<ProjectModel>): Promise<ProjectModel> {
    return await this.projectRepository.create(data);
  }

  async update(
    id: number,
    data: Partial<Attributes<ProjectModel>>,
    userId: number,
    isAdmin: boolean,
  ): Promise<ProjectModel | null> {
    const project = await this.getById(id, userId, isAdmin);
    if (!project) return null;

    return await project.update(data);
  }

  async delete(id: number, userId: number, isAdmin: boolean): Promise<boolean> {
    const project = await this.getById(id, userId, isAdmin);
    if (!project) return false;

    await project.destroy();
    return true;
  }

  async restore(id: number, userId: number, isAdmin: boolean): Promise<ProjectModel | null> {
    const project = await this.projectRepository.findByPkWithParanoid(id, false);
    if (!project) return null;

    // Для восстановления тоже нужна проверка прав
    if (!isAdmin && project.owner_id !== userId) return null;

    await project.restore();
    return project;
  }
}
