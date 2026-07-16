import type { FastifyRequest, FastifyReply, FastifySchema } from 'fastify';

type RequiredFields<T, K extends keyof T> = Required<Pick<T, K>> &
  Partial<Omit<T, K>>;

// export type UserRole = 'admin' | 'user' | 'guest' | 'any';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type AllCrudMethods =
  'getAll' | 'getById' | 'delete' | 'restore' | 'create' | 'update';

export type AuthMethods = 'me' | 'login' | 'logout';

type Action = 'create' | 'read' | 'update' | 'delete' | 'restore';
type Permission = `${string}:${Action}`;

export type RouteSchema<T extends string = never> = Record<
  AllCrudMethods,
  RequiredFields<FastifySchema, 'response'>
> &
  ([T] extends [never]
    ? object
    : Record<T, RequiredFields<FastifySchema, 'response'>>);

export interface RouteControllerConfig {
  handler: (
    request: FastifyRequest<{ Querystring: CommonQuery }>,
    reply: FastifyReply,
  ) => Promise<FastifyReply>;
  schema: RequiredFields<FastifySchema, 'response'>;
  requiredPermissions: Permission[];
  isPublic?: boolean;
  method?: HttpMethods;
  url?: string;
}

export type RouteController<T extends string = never> = Partial<
  Record<AllCrudMethods, RouteControllerConfig>
> &
  ([T] extends [never] ? object : Record<T, RouteControllerConfig>);

export interface CommonQuery {
  includes?: string[];
  scopes?: string[] | Record<string, unknown>;
  page?: number;
  limit?: number;
  filter?: string;
  search?: string;
  sort?: string;
  force?: boolean;
}
