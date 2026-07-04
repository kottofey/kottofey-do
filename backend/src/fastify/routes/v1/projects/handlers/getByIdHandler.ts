import type { FastifyReply, FastifyRequest } from 'fastify';
import { Op } from 'sequelize';

import type { CommonQuery } from '@/fastify/types';
import { getIdFromParams, parseIncludes } from '@/fastify/helpers';
import { ProjectModel } from '@/sequelize/models';

export async function getByIdHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const isAdmin = request.user.roles.some(r => r === 'admin');

  const hasAccess = await ProjectModel.findOne({
    attributes: ['owner_id'],
    where: {
      id,
      [Op.or]: [{ owner_id: request.user.id }, { '$members.id$': request.user.id }],
    },
    include: [{ association: 'members', attributes: [] }],
  });

  if (!isAdmin && hasAccess?.owner_id !== request.user.id) {
    return reply.status(404).send({ message: 'Project not found' });
  }

  const project = await ProjectModel.findByPk(id, {
    include: [...parseIncludes(request), 'members'],
  });

  return reply.status(200).send(project);
}
