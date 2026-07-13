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

  const user = await userService.update({
    id,
    data: request.body as z.infer<typeof userUpdateSchema>,
    currentUser: request.user,
  });

  if (!user) {
    return reply.status(404).send({
      message: `User id ${id.toString()} was not updated`,
    });
  }

  return reply.status(200).send({
    message: `User id ${id.toString()} was updated`,
    user,
  });
}
