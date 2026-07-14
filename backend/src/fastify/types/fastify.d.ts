/* eslint-disable */
import { FastifyContextConfig, FastifyReply, FastifyRequest } from 'fastify';
import { FastifyJwtNamespace } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyContextConfig {
    allowedRoles?: string[];
    requiredPermissions?: string[];
  }

  interface FastifyRequest {
    id?: number;
    email?: string;
    password?: string;
  }

  interface FastifyInstance {
    // -----------------------------------------------------------------------------
    // Декораторы
    // -----------------------------------------------------------------------------
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    checkPermissions: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: number;
    };
    user: {
      id: number;
      email: string;
      roles: string[];
    };
  }
}
