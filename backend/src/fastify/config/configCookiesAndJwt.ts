import { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import ms, { StringValue } from 'ms';

export function configCookiesAndJwt(fastify: FastifyInstance) {
  if (!process.env.COOKIE_SECRET || !process.env.JWT_SECRET) {
    throw Error('В .env не указаны COOKIE_SECRET или JWT_SECRET');
  }

  if (process.env.JWT_EXPIRES_IN && process.env.JWT_REFRESH_EXPIRES_IN) {
    const t = ms(process.env.JWT_EXPIRES_IN as StringValue);
    const rt = ms(process.env.JWT_REFRESH_EXPIRES_IN as StringValue);

    if (t > rt)
      throw Error(
        'Срок жизни JWT_EXPIRES_IN должен быть меньше JWT_REFRESH_EXPIRES_IN. Исправьте в .env',
      );
  }

  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: 'access_token',
      signed: false,
    },
    sign: {
      algorithm: 'HS256',
    },
  });
}
