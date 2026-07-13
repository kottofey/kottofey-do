import Fastify from 'fastify';
import qs from 'qs';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { normalizePort } from '@/fastify/helpers';
import {
  configErrorHandler,
  configLogger,
  getLogger,
  registerCRUDRoute,
  configCookiesAndJwt,
  routesMap,
} from '@/fastify/config';
import { sequelize } from '@/sequelize';
import { authenticateDecorator, checkPersimmionDecorator } from '@/fastify/decorators';

// -----------------------------------------------------------------------------
// Fastify
// -----------------------------------------------------------------------------

export const fastify = Fastify({
  logger: getLogger(),
  serializerOpts: {},
  routerOptions: {
    querystringParser: str => qs.parse(str, { throwOnLimitExceeded: true, comma: true }),
  },
  disableRequestLogging: true,
});

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

configErrorHandler(fastify);
configLogger(fastify);
configCookiesAndJwt(fastify);

// -----------------------------------------------------------------------------
// Decorators register
// -----------------------------------------------------------------------------

fastify.decorate('authenticate', authenticateDecorator);
fastify.decorate('checkPermissions', checkPersimmionDecorator);

// -----------------------------------------------------------------------------
// Hooks register
// -----------------------------------------------------------------------------

// fastify.addHook('onRequest', onRequestHook); // Пример-заглушка

// -----------------------------------------------------------------------------
// Routes register
// -----------------------------------------------------------------------------
let routesCount = 0;

for (const [routeName, controller] of Object.entries(routesMap)) {
  routesCount += registerCRUDRoute(controller, routeName);
}

fastify.log.info(`Endpoints registered: ${routesCount.toString()}`);

// -----------------------------------------------------------------------------
// ORM Init
// -----------------------------------------------------------------------------

try {
  await sequelize.authenticate();
  fastify.log.info('ORM initiated');
} catch (error) {
  console.error('ORM error:', error);
}

// -----------------------------------------------------------------------------
// Server Init
// -----------------------------------------------------------------------------

const port = normalizePort(process.env.FASTIFY_PORT ?? '3000');

fastify.listen({ port }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
