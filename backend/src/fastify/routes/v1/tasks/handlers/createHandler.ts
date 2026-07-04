import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import type { CommonQuery } from '@/fastify/types';
import { TaskModel } from '@/sequelize/models';
import { taskCreateSchema } from '@/fastify/schemas/tasks/partials';

export async function createHandler(
  request: FastifyRequest<{ Querystring: CommonQuery; Body: unknown }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const createdTask = await TaskModel.create(request.body as z.infer<typeof taskCreateSchema>);

  return reply.status(201).send(createdTask);
}
