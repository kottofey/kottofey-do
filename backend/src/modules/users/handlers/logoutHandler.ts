import type { FastifyReply, FastifyRequest } from 'fastify';

import { userService } from '@/modules/users';

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  await userService.logout({ request, reply });

  return reply.send({ message: 'Logged out successfully' });
}
