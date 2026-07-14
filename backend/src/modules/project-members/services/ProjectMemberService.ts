import {
  Attributes,
  CreationAttributes,
  WhereOptions,
  Includeable,
  FindOptions,
} from 'sequelize';

import { ProjectMemberRepository } from '../repositories/ProjectMemberRepository';

import { BaseService } from '@/shared';
import { ProjectMembersModel, ProjectModel } from '@/sequelize/models';
import { CommonQuery } from '@/fastify/types';

export class ProjectMemberService extends BaseService {
  constructor(private projectMemberRepository: ProjectMemberRepository) {
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

    // Логика доступа: админ видит всё, пользователь видит участников проектов, где он сам состоит
    let allowedProjectIds: number[] | null = null;

    if (!isAdmin) {
      const userMemberships = await ProjectMembersModel.findAll({
        attributes: ['project_id'],
        where: { user_id: userId },
      });
      allowedProjectIds = userMemberships.map(m => m.project_id);

      if (allowedProjectIds.length === 0) {
        return {
          data: [],
          meta: this.paginate(0, limit, page),
        };
      }
    }

    const where: WhereOptions = allowedProjectIds
      ? { project_id: allowedProjectIds }
      : {};

    const { rows, count } =
      await this.projectMemberRepository.findAndCountAllWithScopes(
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
  ): Promise<ProjectMembersModel | null> {
    const member = await this.projectMemberRepository.findByPk(id, { include });
    if (!member) return null;

    if (!isAdmin) {
      const isUserInProject = await this.projectMemberRepository.findMember(
        member.project_id,
        userId,
      );
      if (!isUserInProject) return null;
    }

    return member;
  }

  async create(
    data: unknown,
    userId: number,
    isAdmin: boolean,
  ): Promise<ProjectMembersModel> {
    const createData = data as {
      project_id: number;
    } & CreationAttributes<ProjectMembersModel>;
    if (!isAdmin) {
      const project = await ProjectModel.findByPk(createData.project_id);
      if (project?.owner_id !== userId) {
        throw new Error('Only project owner can add members');
      }
    }
    return await this.projectMemberRepository.create(createData);
  }

  async update(
    id: number,
    data: Partial<Attributes<ProjectMembersModel>>,
    userId: number,
    isAdmin: boolean,
  ): Promise<ProjectMembersModel | null> {
    const member = await this.getById(id, userId, isAdmin);
    if (!member) return null;

    if (!isAdmin) {
      const project = await ProjectModel.findByPk(member.project_id);
      if (project?.owner_id !== userId) {
        throw new Error('Only project owner can update members');
      }
    }

    return await member.update(data);
  }

  async delete(id: number, userId: number, isAdmin: boolean): Promise<boolean> {
    const member = await this.getById(id, userId, isAdmin);
    if (!member) return false;

    if (!isAdmin) {
      const project = await ProjectModel.findByPk(member.project_id);
      if (project?.owner_id !== userId) {
        throw new Error('Only project owner can remove members');
      }
    }

    await member.destroy();
    return true;
  }

  async restore(
    id: number,
    userId: number,
    isAdmin: boolean,
  ): Promise<ProjectMembersModel | null> {
    const member = await this.projectMemberRepository.findByPkWithParanoid(
      id,
      false,
    );
    if (!member) return null;

    if (!isAdmin) {
      const project = await ProjectModel.findByPk(member.project_id);
      if (project?.owner_id !== userId) return null;
    }

    await member.restore();
    return member;
  }
}
