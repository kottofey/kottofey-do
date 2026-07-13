import type { FastifyReply, FastifyRequest } from 'fastify';

import { projectMemberService } from '..';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);
  const { roles, id: userId } = request.user;
  const isAdmin = roles.some(r => r === 'admin');

  try {
    const updatedMember = await projectMemberService.update(
      id,
      request.body as Record<string, unknown>,
      userId,
      isAdmin,
    );

    if (!updatedMember) {
      return await reply.status(404).send({
        message: `Project member id ${id.toString()} not found`,
      });
    }

    return await reply.status(200).send({
      message: `Updated project member id ${id.toString()}`,
    });
  } catch (error) {
    return await reply.status(403).send({ message: (error as Error).message });
  }
}
