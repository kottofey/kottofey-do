import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import type { CommonQuery } from '@/fastify/types';
import { ProjectModel } from '@/sequelize/models';
import { projectCreateSchema } from '@/fastify/schemas/projects/partials';

export async function createHandler(
  request: FastifyRequest<{ Querystring: CommonQuery; Body: unknown }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const createdProject = await ProjectModel.create(
    request.body as z.infer<typeof projectCreateSchema>,
  );

  return reply.status(201).send(createdProject);
}
