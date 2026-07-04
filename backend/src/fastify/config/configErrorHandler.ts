import { FastifyInstance } from 'fastify';

export function configErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof Error) {
      return reply.send(error);
    }

    return reply.send(JSON.stringify(error));
  });
}
