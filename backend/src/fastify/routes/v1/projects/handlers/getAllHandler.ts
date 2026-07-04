import type { FastifyReply, FastifyRequest } from 'fastify';
import { Op } from 'sequelize';

import type { CommonQuery } from '@/fastify/types';
import { ProjectModel } from '@/sequelize/models';
import { parseIncludes, parseScopes } from '@/fastify/helpers';
import { PROJECT_SCOPE_HANDLERS } from '@/sequelize/models/Project';

export async function getAllHandler(
  request: FastifyRequest<{ Querystring: CommonQuery }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const {
    query: { page = 1, limit = 10, scopes },
  } = request;

  const userId = request.user.id;
  const isAdmin = request.user.roles.some(r => r === 'admin');

  const offset = (page - 1) * limit;

  // Если не админ — сначала получаем ID проектов, к которым есть доступ
  let projectIds: number[] | null = null;

  if (!isAdmin) {
    // 1. Проекты, где пользователь владелец
    const ownedProjects = await ProjectModel.findAll({
      attributes: ['id'],
      where: { owner_id: userId },
    });

    // 2. Проекты, где пользователь участник
    const memberProjects = await ProjectModel.findAll({
      attributes: ['id'],
      include: [{ association: 'members', attributes: [], required: true }],
      where: { '$members.id$': userId },
    });

    // Объединяем и убираем дубликаты
    const allIds = [...ownedProjects.map(p => p.id), ...memberProjects.map(p => p.id)];
    projectIds = [...new Set(allIds)];

    // Если нет доступа ни к одному проекту — сразу возвращаем пустой результат
    if (projectIds.length === 0) {
      return reply.status(200).send({
        data: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      });
    }
  }

  const { rows, count } = await ProjectModel.scope(
    parseScopes(scopes, PROJECT_SCOPE_HANDLERS),
  ).findAndCountAll({
    include: parseIncludes(request),
    limit,
    offset,
    distinct: true,
    where: {
      ...(projectIds ? { id: { [Op.in]: projectIds } } : {}),
    },
  });

  return reply.status(200).send({
    data: rows,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  });
}
