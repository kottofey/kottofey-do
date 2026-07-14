import { Attributes, Op, Includeable, FindOptions } from 'sequelize';
import { z } from 'zod';

import { ProjectRepository } from '../repositories/ProjectRepository';

import { BaseService } from '@/shared';
import { ProjectModel } from '@/sequelize/models';
import { CommonQuery } from '@/fastify/types';
import { jwtUser } from '@/modules/users/schemas/partials';
import { projectCreateSchema } from '@/modules/projects/schemas/partials';

export class ProjectService extends BaseService {
  constructor(private projectRepository: ProjectRepository) {
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

    const projectIds = await this.getOwnAndMembersProjectIds(currentUser.id);

    if (projectIds?.length === 0) {
      return {
        data: [],
        meta: this.paginate(0, limit, page),
      };
    }

    const where = !this.isAdmin(currentUser.roles)
      ? { id: { [Op.in]: projectIds } }
      : {};

    const { rows, count } =
      await this.projectRepository.findAndCountAllWithScopes(
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
  }: {
    id: number;
    currentUser: z.infer<typeof jwtUser>;
    include?: Includeable | Includeable[];
  }): Promise<ProjectModel | null> {
    const project = await this.projectRepository.findByPk(id, { include });

    if (!project) return null;

    if (!this.isAdmin(currentUser.roles)) {
      const isOwner = this.isProjectOwner({
        projectOwnerId: project.owner_id,
        userId: currentUser.id,
      });

      const isMember = await this.isProjectMember({
        projectId: id,
        userId: currentUser.id,
      });

      if (!isOwner && !isMember) return null;
    }

    return project;
  }

  async create({
    data,
    currentUser,
  }: {
    data: z.infer<typeof projectCreateSchema>;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<ProjectModel> {
    return await this.projectRepository.create({
      ...data,
      owner_id: currentUser.id,
    });
  }

  async update({
    id,
    data,
    currentUser,
  }: {
    id: number;
    data: Partial<Attributes<ProjectModel>>;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<ProjectModel | null> {
    const project = await this.getById({ id, currentUser });
    if (!project) return null;

    return await project.update(data);
  }

  async delete({
    id,
    currentUser,
  }: {
    id: number;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<boolean> {
    const project = await this.getById({
      id,
      currentUser,
    });

    if (!project) return false;

    await project.destroy();
    return true;
  }

  async restore({
    id,
    currentUser,
  }: {
    id: number;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<ProjectModel | null> {
    const project = await this.projectRepository.findByPkWithParanoid(
      id,
      false,
    );
    if (!project) return null;

    if (
      !this.isAllowed({
        currentUserId: currentUser.id,
        currentUserRoles: currentUser.roles,
        recordOwnerId: project.owner_id,
      })
    ) {
      return null;
    }

    await project.restore();
    return project;
  }

  async getOwnAndMembersProjectIds(userId: number): Promise<number[] | null> {
    const { rows: ownedProjects } =
      await this.projectRepository.findAndCountAllWithScopes({
        attributes: ['id'],
        where: { owner_id: userId },
      });

    const { rows: memberProjects } =
      await this.projectRepository.findAndCountAllWithScopes({
        attributes: ['id'],
        include: [
          { association: 'members', attributes: ['id'], required: true },
        ],
        where: { '$members.id$': userId },
      });

    const allIds = [
      ...ownedProjects.map(p => p.id),
      ...memberProjects.map(p => p.id),
    ];
    return allIds.length ? [...new Set(allIds)] : null;
  }

  isProjectOwner({
    projectOwnerId,
    userId,
  }: {
    projectOwnerId: number;
    userId: number;
  }) {
    return projectOwnerId === userId;
  }

  async isProjectMember({
    projectId,
    userId,
  }: {
    projectId: number;
    userId: number;
  }) {
    const { count } = await this.projectRepository.findAndCountAllWithScopes({
      where: { id: projectId },
      attributes: ['id'],
      include: [
        {
          association: 'members',
          attributes: ['id'],
          required: true,
          where: { id: userId },
        },
      ],
    });

    return count > 0;
  }
}
