import { FastifyReply, FastifyRequest } from 'fastify';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { ProjectModel } from '@/sequelize/models';

export async function deleteHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  await ProjectModel.destroy({
    where: {
      id,
      owner_id: request.user.id,
    },
  });

  return reply.status(200).send({
    message: `Deleted Project id ${id.toString()}`,
  });
}
