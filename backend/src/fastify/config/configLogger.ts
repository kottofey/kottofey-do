import { FastifyInstance } from 'fastify';

export function configLogger(fastify: FastifyInstance) {
  if (process.env.NODE_ENV === 'development') {
    fastify.addHook('preHandler', function (req, _reply, done) {
      req.log.info(
        {
          method: req.method,
          url: decodeURIComponent(req.url),
          query: req.query,
          body: req.body,
          // headers: req.headers,
        },
        'Incoming request',
      );
      done();
    });
  }
}
