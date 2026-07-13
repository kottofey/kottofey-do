import type { FastifyReply, FastifyRequest } from 'fastify';

import { RefreshTokenModel } from '@/sequelize/models';

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const refreshToken = request.cookies.refresh_token;

  // TODO переделать на сервис слой
  if (refreshToken) {
    await RefreshTokenModel.destroy({
      where: { token: refreshToken },
    });
  }

  reply.clearCookie('access_token', { path: '/' });
  reply.clearCookie('refresh_token', { path: '/' });

  return reply.send({ message: 'Logged out successfully' });
}
