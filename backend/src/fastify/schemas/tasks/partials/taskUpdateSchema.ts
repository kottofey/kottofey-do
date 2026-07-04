import { taskBaseSchema } from '@/fastify/schemas';

export const taskUpdateSchema = taskBaseSchema
  .omit({
    id: true,
  })
  .partial();
