import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { userUpdateSchema } from '../schemas/partials';
import { userService } from '..';

import { getIdFromParams } from '@/fastify/helpers';
import { type CommonQuery } from '@/fastify/types';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const {
    user: { roles, id: userId },
  } = request;

  const updated = await userService.update(
    id,
    request.body as z.infer<typeof userUpdateSchema>,
    userId,
    roles,
  );

  if (!updated) {
    return reply.status(404).send({
      message: `User id ${id.toString()} was not updated`,
    });
  }

  return reply.status(200).send({
    message: `User id ${id.toString()} was updated`,
  });
}
