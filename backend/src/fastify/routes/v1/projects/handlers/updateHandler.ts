import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getIdFromParams } from '@/fastify/helpers';
import { type CommonQuery } from '@/fastify/types';
import { ProjectModel } from '@/sequelize/models';
import { projectUpdateSchema } from '@/fastify/schemas/projects/partials';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery; Body: unknown }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const [count] = await ProjectModel.update(request.body as z.infer<typeof projectUpdateSchema>, {
    where: { id },
  });

  if (count === 0) {
    return reply.status(404).send({
      message: `Project id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Updated project id ${id.toString()}`,
  });
}
