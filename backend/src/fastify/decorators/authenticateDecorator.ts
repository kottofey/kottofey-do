import type { FastifyReply, FastifyRequest } from 'fastify';
import dayjs from 'dayjs';
import ms, { type StringValue } from 'ms';

import { RefreshTokenModel, UserModel } from '@/sequelize/models';
import { fastify } from '@/fastify';

interface JwtPayload {
  id: number;
  email: string;
  roles: string[];
}

const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export async function authenticateDecorator(request: FastifyRequest, reply: FastifyReply) {
  try {
    fastify.log.info('Trying to authenticate');

    await request.jwtVerify();
  } catch (err: unknown) {
    const error = err as { code?: string };

    if (error.code !== 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
      fastify.log.warn('Что-то неладное');
      return reply.status(401).send({ message: 'Unauthorized', debug_error: error });
    }

    const oldToken = request.cookies.refresh_token;

    if (!oldToken) {
      fastify.log.warn('Refresh Token protuh');
      return reply.status(401).send({ message: 'Сессия истекла' });
    }

    const storedToken = await RefreshTokenModel.findOne({
      where: { token: oldToken },
      include: [{ model: UserModel, as: 'user', include: ['roles'] }],
    });

    if (!storedToken || dayjs().isAfter(storedToken.expires_at)) {
      if (storedToken) await storedToken.destroy(); // Если токен таки есть в БД, но протух - убиваем его
      fastify.log.warn('DB Refresh Token protuh');

      return reply.status(401).send({ message: 'Сессия истекла' });
    }

    const { user } = storedToken;

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
    };

    const [accessToken, refreshToken] = await Promise.all([
      reply.jwtSign(payload, { expiresIn: process.env.JWT_EXPIRES_IN }),
      reply.jwtSign(payload, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }),
    ]);

    const refreshExpiresIn = ms(process.env.JWT_REFRESH_EXPIRES_IN as StringValue);

    await storedToken.update({
      token: refreshToken,
      expires_at: dayjs().add(refreshExpiresIn, 'ms').toDate(),
    });

    reply.setCookie('access_token', accessToken, COOKIE_OPTIONS);
    reply.setCookie('refresh_token', refreshToken, COOKIE_OPTIONS);

    request.user = payload;

    fastify.log.info('Token successfully refreshed');
  }

  const user = await UserModel.findByPk(request.user.id);

  if (!user || user.deleted_at) {
    return reply.status(401).send({ message: 'Аккаунт отключен' });
  }

  fastify.log.info('Authenticated ok');
}
