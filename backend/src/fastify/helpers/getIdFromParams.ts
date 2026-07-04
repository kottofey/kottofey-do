import { FastifyRequest } from 'fastify';

export function getIdFromParams(req: FastifyRequest): number {
  const { id } = req.params as { id: unknown };

  return Number(id);
}
