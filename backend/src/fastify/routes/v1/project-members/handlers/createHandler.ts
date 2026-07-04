import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import type { CommonQuery } from '@/fastify/types';
import { ProjectMembersModel } from '@/sequelize/models';
import { projectMemberCreateSchema } from '@/fastify/schemas/project-members/partials';

export async function createHandler(
  request: FastifyRequest<{ Querystring: CommonQuery; Body: unknown }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const createdProjectMember = await ProjectMembersModel.create(
    request.body as z.infer<typeof projectMemberCreateSchema>,
  );

  return reply.status(201).send(createdProjectMember);
}
