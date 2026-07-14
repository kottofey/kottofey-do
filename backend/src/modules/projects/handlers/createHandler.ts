import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { projectService } from '..';

import { projectCreateSchema } from '@/modules/projects/schemas/partials';
import type { CommonQuery } from '@/fastify/types';

export async function createHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const newProject = request.body as z.infer<typeof projectCreateSchema>;

  const createdProject = await projectService.create({
    data: newProject,
    currentUser: request.user,
  });

  return reply.status(201).send(createdProject);
}
