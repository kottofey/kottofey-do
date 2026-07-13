import type { FastifyReply, FastifyRequest } from 'fastify';
import dayjs from 'dayjs';
import ms, { type StringValue } from 'ms';

import { userService } from '..';

import { RefreshTokenModel } from '@/sequelize/models';

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { email = '', password = '' } = request.body as FastifyRequest<{
    Body: { email?: string; password?: string };
  }>;

  const user = await userService.validateUser(email, password);

  if (!user) {
    return reply.status(401).send({ message: 'Неверные данные для входа' });
  }

  // С юзером все в порядке, логинимся дальше

  const payload = {
    id: user.id,
    email: user.email,
    roles: user.roles.map(r => r.name),
  };

  const accessToken = await reply.jwtSign(payload, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refreshToken = await reply.jwtSign(payload, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  const refreshExpiresIn = ms(process.env.JWT_REFRESH_EXPIRES_IN as StringValue);
  // TODO переделать на сервис слой

  await RefreshTokenModel.create({
    token: refreshToken,
    user_id: user.id,
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

  return reply.send({
    message: 'Logged in successfully',
    user: payload,
  });
}
