import { z } from 'zod';

export const jwtUser = z.object({
  id: z.number(),
  email: z.string(),
  roles: z.string().array(),
});
