import { z } from 'zod';

import { userShortSchema } from '@/fastify/schemas/users/partials';
import { projectShortSchema } from '@/fastify/schemas/projects/partials';

export const taskBaseSchema = z.object({
  id: z.number(),
  project_id: z.number().nullish(),
  owner_id: z.number(),
  title: z.string(),
  priority: z.enum(['high', 'normal', 'low']),
  sort_order: z.number().nullish(),
  is_done: z.boolean(),
  is_archived: z.boolean(),

  project: projectShortSchema.nullish(),
  owner: userShortSchema.nullish(),

  created_at: z.number(),
  updated_at: z.number(),
  deleted_at: z.number().nullish(),
});
