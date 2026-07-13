import { Attributes, WhereOptions, Includeable, FindOptions } from 'sequelize';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { UserRepository } from '../repositories/UserRepository';
import { userCreateSchema, userUpdateSchema } from '../schemas/partials';

import { BaseService } from '@/shared';
import { RoleModel, UserModel } from '@/sequelize/models';
import { CommonQuery } from '@/fastify/types';
import { sequelize } from '@/sequelize';

export class UserService extends BaseService {
  constructor(private userRepository: UserRepository) {
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

    const where: WhereOptions = !isAdmin ? { owner_id: userId } : {};

    const { rows, count } = await this.userRepository.findAndCountAllWithScopes(
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
  ): Promise<UserModel | null> {
    const user = await this.userRepository.findByPk(id, { include });

    if (!user) return null;
    if (!isAdmin && user.id !== userId) return null;
    //TODO Допилить хелперы проверки this.isAdmin / this.isAllowed
    return user;
  }

  async create(data: z.infer<typeof userCreateSchema>): Promise<UserModel> {
    const { email, password, roles } = data;

    const t = await sequelize.transaction();

    const hashedPassword = await bcrypt.hash(password, 10);

    // await this.userRepository.setRolesToUser(user.id, roles);
    const user = await this.userRepository.create(
      {
        email,
        password_hash: hashedPassword,
      },
      { transaction: t },
    );

    if (roles.length > 0) {
      const foundRoles = await RoleModel.findAll({ where: { name: roles } });

      if (!foundRoles.length) {
        await t.rollback();
        throw Error(`Одной из ролей не существует: [${roles.join(', ')}]`);
      }

      const roleIds = foundRoles.map(role => role.id);

      await this.userRepository.setRolesToUser(user, roleIds, t);
    }

    // обновляем инстанс нового юзера чтобы сработал дефолтный скоуп, убирающий пароль
    await user.reload({ transaction: t });

    await t.commit();

    return user;
  }

  async update(
    id: number,
    data: Partial<Attributes<UserModel>>,
    userId: number,
    roles: string[],
  ): Promise<boolean> {
    console.log('rrr', roles);
    const user = await this.getById(id, userId, this.isAdmin(roles));

    if (!user || !this.isAllowed(id, userId, roles)) return false;

    const { password, ...restUser } = data as z.infer<typeof userUpdateSchema>;

    const hashedPassword = password && (await bcrypt.hash(password, 10));

    await user.update({ ...restUser, password_hash: hashedPassword });
    return true;
  }

  async delete(id: number, userId: number, isAdmin: boolean): Promise<boolean> {
    const user = await this.getById(id, userId, isAdmin);

    if (!user) return false;

    await user.destroy();
    return true;
  }

  async restore(id: number, userId: number, isAdmin: boolean): Promise<boolean> {
    const user = await this.userRepository.findByPkWithParanoid(id, false);
    if (!user?.deleted_at || !isAdmin) return false;

    await user.restore();
    return true;
  }

  async findUserExcludingPassword(userId: number): Promise<UserModel | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async validateUser(email: string, password: string): Promise<UserModel | null> {
    const user = await this.userRepository.findByEmail(email, true);

    if (!user?.password_hash) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return null;

    if (user.deleted_at) return null;

    return user;
  }

  isAdmin(roles: string[]) {
    return roles.some(r => r === 'admin');
  }

  isAllowed(id: number, userId: number, roles: string[]) {
    return id === userId || this.isAdmin(roles);
  }
}
