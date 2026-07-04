import { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

export function configCookiesAndJwt(fastify: FastifyInstance) {
  if (!process.env.COOKIE_SECRET || !process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw Error('В .env не указаны COOKIE_SECRET или JWT_SECRET или JWT_EXPIRES_IN');
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
