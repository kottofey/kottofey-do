import { z } from 'zod';

export const roleBaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),

  created_at: z.number(),
  updated_at: z.number(),
  deleted_at: z.number().nullish(),
});
