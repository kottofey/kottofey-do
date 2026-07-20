import { Attributes, FindOptions, Includeable } from 'sequelize';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import ms, { type StringValue } from 'ms';
import type { FastifyReply, FastifyRequest } from 'fastify';
import dayjs from 'dayjs';

import { UserRepository } from '../repositories/UserRepository';
import {
  jwtUser,
  userCreateSchema,
  userUpdateSchema,
} from '../schemas/partials';

import { BaseService } from '@/shared';
import { RefreshTokenModel, UserModel } from '@/sequelize/models';
import { CommonQuery } from '@/fastify/types';
import { sequelize } from '@/sequelize';

export class UserService extends BaseService {
  constructor(private userRepository: UserRepository) {
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

    const where = !this.isAdmin(currentUser.roles)
      ? { id: currentUser.id }
      : {};

    const { rows, count } = await this.userRepository.findAndCountAllWithScopes(
      {
        limit,
        offset,
        where,
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
  }): Promise<UserModel | null> {
    const foundUser = await this.userRepository.findByPk(id, { include });

    if (
      !foundUser ||
      !this.isAllowed({
        currentUserId: currentUser.id,
        currentUserRoles: currentUser.roles,
        recordOwnerId: id,
      })
    ) {
      return null;
    }

    return foundUser;
  }

  async create(data: z.infer<typeof userCreateSchema>): Promise<UserModel> {
    const { email, password, roles } = data;

    const t = await sequelize.transaction();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create(
      {
        email,
        password_hash: hashedPassword,
      },
      { transaction: t },
    );

    if (roles.length) {
      await this.userRepository.setRolesToUser({
        user,
        roles,
        transaction: t,
      });
    }

    // обновляем инстанс нового юзера чтобы сработал дефолтный скоуп, убирающий пароль

    await t.commit();

    await user.reload();

    return user;
  }

  async update({
    id,
    currentUser,
    data,
  }: {
    id: number;
    data: Partial<Attributes<UserModel>>;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<UserModel | null> {
    if (
      !this.isAllowed({
        currentUserId: currentUser.id,
        currentUserRoles: currentUser.roles,
        recordOwnerId: id,
      })
    ) {
      return null;
    }

    const user = await this.getById({ id, currentUser });

    if (user) {
      const t = await sequelize.transaction();

      const { password, roles, ...restUser } = data as z.infer<
        typeof userUpdateSchema
      >;

      const hashedPassword = password && (await bcrypt.hash(password, 10));

      await this.userRepository.update(id, {
        ...restUser,
        password_hash: hashedPassword,
      });

      if (roles?.length) {
        await this.userRepository.setRolesToUser({
          user,
          roles,
          transaction: t,
        });
      }

      await t.commit();
      await user.reload();
    }

    return user;
  }

  async delete({
    id,
  }: {
    id: number;
    currentUser: z.infer<typeof jwtUser>;
  }): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async restore({ id }: { id: number }): Promise<UserModel | null> {
    return await this.userRepository.restore(id);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserModel | null> {
    const user = await this.userRepository.findByEmail(email, true);

    if (!user?.password_hash) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return null;

    if (user.deleted_at) return null;

    return user;
  }

  async login({
    request,
    reply,
  }: {
    request: FastifyRequest;
    reply: FastifyReply;
  }): Promise<z.infer<typeof jwtUser> | null> {
    const { email = '', password = '' } = request.body as FastifyRequest<{
      Body: { email?: string; password?: string };
    }>;

    const validatedUser = await this.validateUser(email, password);

    if (!validatedUser) return Promise.resolve(null);

    // С юзером все в порядке, логинимся дальше

    const payload = {
      id: validatedUser.id,
      email: validatedUser.email,
      roles: validatedUser.roles.map(r => r.name),
    };

    const { accessToken, refreshToken } = await this.generateTokens({
      reply,
      payload,
    });

    const refreshExpiresIn = ms(
      process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
    );

    // TODO переделать на сервис слой

    await RefreshTokenModel.create({
      token: refreshToken,
      user_id: validatedUser.id,
      expires_at: dayjs().add(refreshExpiresIn, 'ms').toDate(),
      user_agent: request.headers['user-agent'],
      ip_address: request.ip,
    });

    reply.setCookie('access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ms(process.env.JWT_EXPIRES_IN as StringValue) * 1000,
    });

    reply.setCookie('refresh_token', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ms(process.env.JWT_REFRESH_EXPIRES_IN as StringValue) * 1000,
    });

    request.user = payload;

    return Promise.resolve(payload);
  }

  async logout({
    request,
    reply,
  }: {
    request: FastifyRequest;
    reply: FastifyReply;
  }): Promise<void> {
    const refreshToken = request.cookies.refresh_token;

    // TODO переделать на сервис слой
    if (refreshToken) {
      await RefreshTokenModel.destroy({
        where: { token: refreshToken },
      });
    }

    reply.clearCookie('access_token', { path: '/' });
    reply.clearCookie('refresh_token', { path: '/' });
  }

  async generateTokens({
    payload,
    reply,
  }: {
    payload: z.infer<typeof jwtUser>;
    reply: FastifyReply;
  }): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await reply.jwtSign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = await reply.jwtSign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getMe({
    request,
  }: {
    request: FastifyRequest;
    reply: FastifyReply;
  }): Promise<z.infer<typeof jwtUser> | null> {
    const user = await this.getById({
      id: request.user.id,
      currentUser: request.user,
    });

    if (user) {
      const { roles, id, email } = user;

      return {
        id,
        email,
        roles: roles.map(r => r.name),
      };
    }
    return null;
  }
}
