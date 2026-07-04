import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getIdFromParams } from '@/fastify/helpers';
import { type CommonQuery } from '@/fastify/types';
import { TaskModel } from '@/sequelize/models';
import { taskUpdateSchema } from '@/fastify/schemas/tasks/partials';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery; Body: unknown }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const [count] = await TaskModel.update(request.body as z.infer<typeof taskUpdateSchema>, {
    where: { id, owner_id: request.user.id },
  });

  if (count === 0) {
    return reply.status(404).send({
      message: `Task id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Updated task id ${id.toString()}`,
  });
}
