import { FastifyReply, FastifyRequest } from 'fastify';

import { type CommonQuery } from '@/fastify/types';
import { getIdFromParams } from '@/fastify/helpers';
import { ProjectMembersModel } from '@/sequelize/models';

export async function deleteHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  await ProjectMembersModel.destroy({ where: { id } });

  return reply.status(200).send({
    message: `Deleted Project member id ${id.toString()}`,
  });
}
