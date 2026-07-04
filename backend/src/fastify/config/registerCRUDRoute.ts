import type { RouteShorthandOptions } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { CommonQuery, RouteController, RouteControllerConfig } from '@/fastify/types';
import { fastify } from '@/fastify';

/**
 * Возвращает количество подключенных эндпоинтов для переданного контроллера
 * @param controller
 * @param routeName
 */
export function registerCRUDRoute(controller: RouteController, routeName: string): number {
  for (const [crudMethod, config] of Object.entries(
    controller as Record<keyof RouteController, RouteControllerConfig>,
  )) {
    if (Array.isArray(config.allowedRoles)) {
      const opts: RouteShorthandOptions = {
        schema: config.schema,
        config: {
          allowedRoles: config.allowedRoles,
        },
      };

      switch (crudMethod) {
        case 'getAll':
          fastify
            .withTypeProvider<ZodTypeProvider>()
            .get<{ Querystring: CommonQuery }>(
              `/${routeName}`,
              { ...opts, onRequest: [fastify.authenticate, fastify.checkPermissions] },
              config.handler,
            );
          break;
        case 'getById':
          fastify
            .withTypeProvider<ZodTypeProvider>()
            .get<{ Querystring: CommonQuery }>(
              `/${routeName}/:id`,
              { ...opts, onRequest: [fastify.authenticate, fastify.checkPermissions] },
              config.handler,
            );
          break;
        case 'create':
          fastify.withTypeProvider<ZodTypeProvider>().post<{
            Querystring: CommonQuery;
            Body: unknown;
          }>(`/${routeName}`, { ...opts, onRequest: [fastify.authenticate, fastify.checkPermissions] }, config.handler);
          break;
        case 'update':
          fastify.withTypeProvider<ZodTypeProvider>().put<{
            Querystring: CommonQuery;
            Body: unknown;
          }>(`/${routeName}/:id`, { ...opts, onRequest: [fastify.authenticate, fastify.checkPermissions] }, config.handler);
          break;
        case 'delete':
          fastify
            .withTypeProvider<ZodTypeProvider>()
            .delete<{ Querystring: CommonQuery }>(
              `/${routeName}/:id`,
              { ...opts, onRequest: [fastify.authenticate, fastify.checkPermissions] },
              config.handler,
            );
          break;
        case 'restore':
          fastify.withTypeProvider<ZodTypeProvider>().post<{
            Querystring: CommonQuery;
          }>(`/${routeName}/:id/restore`, { ...opts, onRequest: [fastify.authenticate, fastify.checkPermissions] }, config.handler);
          break;

        // Auth routes
        case 'me':
          fastify
            .withTypeProvider<ZodTypeProvider>()
            .get<{ Querystring: CommonQuery }>(
              '/me',
              { ...opts, onRequest: [fastify.authenticate, fastify.checkPermissions] },
              config.handler,
            );
          break;

        case 'login':
          fastify
            .withTypeProvider<ZodTypeProvider>()
            .post<{ Querystring: CommonQuery }>('/login', { ...opts }, config.handler);
          break;

        case 'logout':
          fastify
            .withTypeProvider<ZodTypeProvider>()
            .delete<{ Querystring: CommonQuery }>(
              '/logout',
              { ...opts, onRequest: [fastify.authenticate, fastify.checkPermissions] },
              config.handler,
            );
          break;
      }
    }
  }

  return Object.keys(controller).length;
}
