import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { userCreateSchema } from '../schemas/partials';

import type { CommonQuery } from '@/fastify/types';
import { userService } from '@/modules/users';

export async function createHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const user = await userService.create(request.body as z.infer<typeof userCreateSchema>);

  return reply.status(201).send(user);
}
