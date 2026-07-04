import type { FastifyRequest, FastifyReply, FastifySchema } from 'fastify';

type RequiredFields<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>;

export type UserRole = 'admin' | 'user' | 'guest' | 'any';

export type AllCrudMethods = Readonly<
  'getAll' | 'getById' | 'delete' | 'restore' | 'create' | 'update'
>;

type Action = 'create' | 'read' | 'update' | 'delete' | 'restore';
type Permission = `${string}:${Action}`;

export interface User {
  id: number;
  name: string;
  role: UserRole;
}

export interface RouteControllerConfig {
  handler: (
    request: FastifyRequest<{ Querystring: CommonQuery; Body?: unknown }>,
    reply: FastifyReply,
  ) => Promise<FastifyReply>;
  schema: RequiredFields<FastifySchema, 'response'>;
  allowedRoles: UserRole[];
  requiredPermissions: Permission[];
}

export interface RouteController {
  getAll?: RouteControllerConfig;
  getById?: RouteControllerConfig;
  create?: RouteControllerConfig;
  update?: RouteControllerConfig;
  delete?: RouteControllerConfig;
  restore?: RouteControllerConfig;

  me?: RouteControllerConfig;
  login?: RouteControllerConfig;
  logout?: RouteControllerConfig;
}

export interface CommonQuery {
  includes?: string[];
  scopes?: string[] | Record<string, unknown>;
  page?: number;
  limit?: number;
  filter?: string;
  search?: string;
  sort?: string;
}
