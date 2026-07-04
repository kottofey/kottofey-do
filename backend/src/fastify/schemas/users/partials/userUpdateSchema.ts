import { z } from 'zod';

import { userBaseSchema } from '@/fastify/schemas';

export const userUpdateSchema = userBaseSchema
  .omit({
    id: true,
  })
  .extend({
    password: z.string().min(5),
  })
  .partial();
