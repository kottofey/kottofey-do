import { z } from 'zod';

export const taskShortSchema = z.object({
  id: z.number(),
  project_id: z.number().nullish(),
  owner_id: z.number(),
  title: z.string(),
  priority: z.enum(['high', 'normal', 'low']),
  sort_order: z.number().nullish(),
  is_done: z.boolean(),
  is_archived: z.boolean(),
});
