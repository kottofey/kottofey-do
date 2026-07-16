import type { RouteShorthandOptions } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  CommonQuery,
  RouteController,
  RouteControllerConfig,
} from '@/fastify/types';
import { fastify } from '@/fastify';

/**
 * Возвращает количество подключенных эндпоинтов для переданного контроллера
 * @param controller
 * @param routeName
 */
export function registerCRUDRoute(
  controller: RouteController,
  routeName: string,
): number {
  for (const [crudMethod, config] of Object.entries(
    controller as Record<keyof RouteController, RouteControllerConfig>,
  )) {
    const opts: RouteShorthandOptions = {
      schema: config.schema,
      config: {
        requiredPermissions: config.requiredPermissions,
        isPublic: config.isPublic,
      },
    };

    const onRequest = [];

    if (!config.isPublic) {
      onRequest.push(...[fastify.authenticate, fastify.checkPermissions]);
    }

    switch (crudMethod) {
      case 'getAll': {
        fastify
          .withTypeProvider<ZodTypeProvider>()
          .get<{ Querystring: CommonQuery }>(
            `/${routeName}`,
            {
              ...opts,
              onRequest,
            },
            config.handler,
          );
        break;
      }

      case 'getById': {
        fastify
          .withTypeProvider<ZodTypeProvider>()
          .get<{ Querystring: CommonQuery }>(
            `/${routeName}/:id`,
            {
              ...opts,
              onRequest,
            },
            config.handler,
          );
        break;
      }

      case 'create': {
        fastify.withTypeProvider<ZodTypeProvider>().post<{
          Querystring: CommonQuery;
          Body: unknown;
        }>(
          `/${routeName}`,
          {
            ...opts,
            onRequest,
          },
          config.handler,
        );
        break;
      }
      case 'update': {
        fastify.withTypeProvider<ZodTypeProvider>().put<{
          Querystring: CommonQuery;
          Body: unknown;
        }>(
          `/${routeName}/:id`,
          {
            ...opts,
            onRequest,
          },
          config.handler,
        );
        break;
      }

      case 'delete': {
        fastify
          .withTypeProvider<ZodTypeProvider>()
          .delete<{ Querystring: CommonQuery }>(
            `/${routeName}/:id/:force?`,
            {
              ...opts,
              onRequest,
            },
            config.handler,
          );
        break;
      }

      case 'restore': {
        fastify.withTypeProvider<ZodTypeProvider>().put<{
          Querystring: CommonQuery;
        }>(
          `/${routeName}/:id/restore`,
          {
            ...opts,
            onRequest,
          },
          config.handler,
        );
        break;
      }

      default: {
        if (config.method && config.url) {
          const fullUrl = config.url.startsWith('/')
            ? `/${routeName}${config.url}`
            : `/${routeName}/${config.url}`;

          fastify.withTypeProvider<ZodTypeProvider>().route({
            method: config.method,
            url: fullUrl,
            schema: config.schema,
            onRequest,
            handler: config.handler,
            config: opts.config,
          });
        }
        break;
      }
    }
  }

  return Object.keys(controller).length;
}
