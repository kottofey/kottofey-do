import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { roleService } from '..';

import { getIdFromParams } from '@/fastify/helpers';
import { type CommonQuery } from '@/fastify/types';
import { roleUpdateSchema } from '@/modules/roles/schemas/partials/roleUpdateSchema';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const role = await roleService.update({
    id,
    data: request.body as z.infer<typeof roleUpdateSchema>,
    currentUser: request.user,
  });

  if (!role) {
    return reply.status(404).send({
      message: `Role id ${id.toString()} was not updated`,
    });
  }

  return reply.status(200).send({
    message: `Role id ${id.toString()} was updated`,
    role,
  });
}
