//TODO
import { z } from 'zod';

export const responseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.string().optional(),
});
