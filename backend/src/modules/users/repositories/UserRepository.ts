import { FindOptions, Includeable, Transaction } from 'sequelize';

import { UserModel } from '@/sequelize/models';
import { BaseRepository } from '@/shared';
import { CommonQuery } from '@/fastify/types';
import { parseScopes } from '@/fastify/helpers';
import { USER_SCOPE_HANDLERS } from '@/sequelize/models/User';

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
      col: 'UserModel.id',
    });
  }

  async findByEmail(email: string, withPassword = false): Promise<UserModel | null> {
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

  async findByPkWithParanoid(id: number, paranoid = true): Promise<UserModel | null> {
    return await this.model.findByPk(id, { paranoid });
  }

  async setRolesToUser(user: UserModel, roles: number[], transaction: Transaction) {
    await user.$set('roles', roles, { transaction });
  }
}
