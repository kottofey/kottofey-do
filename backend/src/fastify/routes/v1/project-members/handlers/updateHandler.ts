import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getIdFromParams } from '@/fastify/helpers';
import { type CommonQuery } from '@/fastify/types';
import { ProjectMembersModel } from '@/sequelize/models';
import { projectMemberUpdateSchema } from '@/fastify/schemas/project-members/partials';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery; Body: unknown }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const [count] = await ProjectMembersModel.update(
    request.body as z.infer<typeof projectMemberUpdateSchema>,
    {
      where: { id },
    },
  );

  if (count === 0) {
    return reply.status(404).send({
      message: `Project member id ${id.toString()} not found`,
    });
  }

  return reply.status(200).send({
    message: `Updated project member id ${id.toString()}`,
  });
}
