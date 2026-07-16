/* eslint-disable */
import { UserRoles } from './types';

declare module 'fastify' {
  interface FastifyContextConfig {
    requiredPermissions?: string[];
    isPublic?: boolean;
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
