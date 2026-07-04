import { taskBaseSchema } from '@/fastify/schemas';

export const taskUpdateSchema = taskBaseSchema
  .omit({
    id: true,
    owner_id: true,
  })
  .partial();
