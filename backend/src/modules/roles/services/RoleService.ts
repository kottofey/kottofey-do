import { Attributes, FindOptions, Includeable } from 'sequelize';
import { z } from 'zod';

import { RoleRepository } from '../repositories/RoleRepository';

import { BaseService } from '@/shared';
import { jwtUser } from '@/modules/users/schemas/partials';
import { RoleModel } from '@/sequelize/models';
import {
  roleUpdateSchema,
  roleCreateSchema,
} from '@/modules/roles/schemas/partials';

export class RoleService extends BaseService {
  constructor(private roleRepository: RoleRepository) {
    super();
  }

  async getAll({
    page,
    limit,
    currentUser,
    include,
  }: {
    page: number;
    limit: number;
    currentUser: z.infer<typeof jwtUser>;
    include?: Includeable | Includeable[];
  }) {
    const offset = (page - 1) * limit;

    const where = !this.isAdmin(currentUser.roles)
      ? { id: currentUser.id }
      : {};

    const { rows, count } = await this.roleRepository.findAndCountAll({
      limit,
      offset,
      where,
      include,
    } as FindOptions);

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
  }): Promise<RoleModel | null> {
    const foundRole = await this.roleRepository.findByPk(id, { include });

    if (
      !foundRole ||
      !this.isAllowed({
        currentUserId: currentUser.id,
        currentUserRoles: currentUser.roles,
        recordOwnerId: id,
      })
    ) {
      return null;
    }

    return foundRole;
  }

  async create(data: z.infer<typeof roleCreateSchema>): Promise<RoleModel> {
    const { name, description } = data;

    return await this.roleRepository.create({
      name,
      description,
    });
  }

  async update({
    id,
    currentUser,
    data,
  }: {
    id: number;
    data: Partial<Attributes<RoleModel>>;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<RoleModel | null> {
    if (
      !this.isAllowed({
        currentUserId: currentUser.id,
        currentUserRoles: currentUser.roles,
        recordOwnerId: id,
      })
    ) {
      return null;
    }

    const role = await this.getById({ id, currentUser });

    if (!role) return null;

    const { name, description } = data as z.infer<typeof roleUpdateSchema>;

    return await this.roleRepository.update(id, { name, description });
  }

  async delete({
    id,
  }: {
    id: number;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<boolean> {
    return await this.roleRepository.delete(id);
  }

  async restore({ id }: { id: number }): Promise<RoleModel | null> {
    return await this.roleRepository.restore(id);
  }

  async findByName(name: string) {
    return this.roleRepository.findOne({
      where: { name },
    });
  }
}
