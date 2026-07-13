import { FastifyReply, FastifyRequest } from 'fastify';

import { projectService } from '..';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';

export async function deleteHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);
  const { roles, id: userId } = request.user;
  const isAdmin = roles.some(r => r === 'admin');

  const deleted = await projectService.delete(id, userId, isAdmin);

  if (!deleted) {
    return reply.status(404).send({
      message: `Project id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Deleted Project id ${id.toString()}`,
  });
}
