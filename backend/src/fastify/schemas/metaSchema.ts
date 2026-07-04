import { z } from 'zod';

export const metaSchema = z.object({
  total: z.number().int().nonnegative(),
  limit: z.coerce.number().int().positive().max(100).default(10),
  page: z.coerce.number().int().positive().default(1),
  totalPages: z.number().int().nonnegative(),
});
