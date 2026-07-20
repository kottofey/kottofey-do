import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { roleCreateSchema } from '../schemas/partials';

import type { CommonQuery } from '@/fastify/types';
import { roleService } from '@/modules/roles';

export async function createHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const user = await roleService.create(
    request.body as z.infer<typeof roleCreateSchema>,
  );

  return reply.status(201).send(user);
}
