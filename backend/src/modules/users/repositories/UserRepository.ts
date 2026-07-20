import { FindOptions, Transaction } from 'sequelize';
import { z } from 'zod';

import { UserModel } from '@/sequelize/models';
import { BaseRepository } from '@/shared';
import { CommonQuery } from '@/fastify/types';
import { parseScopes } from '@/fastify/helpers';
import { USER_SCOPE_HANDLERS } from '@/sequelize/models/User';
import { roleService } from '@/modules/roles';
import { roleUpdateSchema } from '@/modules/roles/schemas/partials';

export class UserRepository extends BaseRepository<UserModel> {
  constructor() {
    super(UserModel);
  }

  async findAndCountAllWithScopes(
    options: FindOptions,
    scopes?: CommonQuery['scopes'],
  ): Promise<{ rows: UserModel[]; count: number }> {
    const scopedModel = scopes
      ? this.getScopedModel(parseScopes(scopes, USER_SCOPE_HANDLERS))
      : this.model;

    return await (scopedModel as typeof UserModel).findAndCountAll({
      ...options,
      distinct: true,
      include: ['roles'],
    });
  }

  async findByEmail(
    email: string,
    withPassword = false,
  ): Promise<UserModel | null> {
    if (withPassword) {
      return await this.model.unscoped().findOne({
        where: { email },
        include: ['roles'],
      });
    }

    return await this.model.findOne({
      where: { email },
      include: ['roles'],
    });
  }

  async findByPkWithParanoid(
    id: number,
    paranoid = true,
  ): Promise<UserModel | null> {
    return await this.model.findByPk(id, { paranoid });
  }

  async setRolesToUser({
    user,
    roles,
    transaction,
  }: {
    user: UserModel;
    roles: z.infer<typeof roleUpdateSchema>[];
    transaction: Transaction;
  }) {
    if (!roles.length) {
      throw new Error('Роли не указаны');
    }

    const foundRoles = await Promise.all(
      roles.map(async role => {
        if (!role.name) {
          throw new Error('Название роли не указано');
        }

        const foundRole = await roleService.findByName(role.name);

        if (!foundRole) {
          throw new Error(`Роль не существует: "${role.name}"`);
        }

        return foundRole;
      }),
    );

    // Устанавливаем роли пользователю
    await user.$set('roles', foundRoles, { transaction });
  }
}
