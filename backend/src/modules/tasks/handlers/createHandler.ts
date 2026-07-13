import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { taskService } from '..';

import { taskCreateSchema } from '@/modules/tasks/schemas/partials';
import type { CommonQuery } from '@/fastify/types';

export async function createHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const newTask = request.body as z.infer<typeof taskCreateSchema>;

  const createdTask = await taskService.create({
    ...newTask,
    owner_id: request.user.id,
  });

  return reply.status(201).send(createdTask);
}
