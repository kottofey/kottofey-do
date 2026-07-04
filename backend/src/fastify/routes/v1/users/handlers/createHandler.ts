import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';

import type { CommonQuery } from '@/fastify/types';
import { UserModel } from '@/sequelize/models';
import { userCreateSchema } from '@/fastify/schemas/users/partials';

export async function createHandler(
  request: FastifyRequest<{ Querystring: CommonQuery; Body: unknown }>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  const { password, email } = request.body as z.infer<typeof userCreateSchema>;

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await UserModel.create({
    email,
    password_hash: hashedPassword,
  });

  const createdUserJson: UserModel = createdUser.toJSON();

  delete createdUserJson.password_hash;

  return reply.status(201).send(createdUserJson);
}
