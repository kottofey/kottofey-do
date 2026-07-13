import type { FastifyReply, FastifyRequest } from 'fastify';

import { projectMemberService } from '..';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams, parseIncludes } from '@/fastify/helpers';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);
  const { roles, id: userId } = request.user;
  const isAdmin = roles.some(r => r === 'admin');

  const projectMember = await projectMemberService.getById(
    id,
    userId,
    isAdmin,
    parseIncludes(request),
  );

  if (!projectMember) {
    return reply.status(404).send({ message: 'Project member not found' });
  }

  return reply.status(200).send(projectMember);
}
