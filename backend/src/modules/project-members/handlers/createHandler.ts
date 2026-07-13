import type { FastifyReply, FastifyRequest } from 'fastify';

import { projectMemberService } from '..';

import type { CommonQuery } from '@/fastify/types';

export async function createHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { roles, id: userId } = request.user;
  const isAdmin = roles.some(r => r === 'admin');

  try {
    const createdProjectMember = await projectMemberService.create(request.body, userId, isAdmin);

    return await reply.status(201).send(createdProjectMember);
  } catch (error) {
    return await reply.status(403).send({ message: (error as Error).message });
  }
}
