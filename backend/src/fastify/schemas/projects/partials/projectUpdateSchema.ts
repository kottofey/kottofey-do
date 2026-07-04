import { projectBaseSchema } from '@/fastify/schemas';

export const projectUpdateSchema = projectBaseSchema
  .omit({
    id: true,
  })
  .partial();
