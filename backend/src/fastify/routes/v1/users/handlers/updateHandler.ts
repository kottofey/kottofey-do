import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';

import { getIdFromParams } from '@/fastify/helpers';
import { type CommonQuery } from '@/fastify/types';
import { UserModel } from '@/sequelize/models';
import { userUpdateSchema } from '@/fastify/schemas/users/partials';

export async function updateHandler(
  request: FastifyRequest<{ Querystring: CommonQuery; Body: unknown }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const id = getIdFromParams(request);

  const {
    user: { roles },
  } = request;

  const isAdmin = roles.some(r => r === 'admin');
  const isAllowedToUpdate = isAdmin || id === request.user.id;

  const user = await UserModel.findOne({
    where: { id },
    attributes: {
      exclude: ['password_hash'],
    },
  });

  if (!user || !isAllowedToUpdate) {
    return reply.status(404).send({
      message: `User id ${id.toString()} was not found`,
    });
  }

  const { password, ...restUser } = request.body as z.infer<typeof userUpdateSchema>;

  const hashedPassword = password && (await bcrypt.hash(password, 10));

  const updatedUser = await user.update(
    { ...restUser, password_hash: hashedPassword },
    {
      where: { id },
    },
  );

  return reply.status(200).send(updatedUser);
}
