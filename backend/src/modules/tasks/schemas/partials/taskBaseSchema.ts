import { z } from 'zod';

import { userShortSchema } from '../../../users/schemas/partials';
import { projectShortSchema } from '../../../projects/schemas/partials';

export const taskBaseSchema = z.object({
  id: z.number(),
  owner_id: z.number(),
  project_id: z.number().nullish(),
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
