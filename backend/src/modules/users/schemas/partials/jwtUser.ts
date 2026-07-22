import { z } from 'zod';

import { roleSchema } from './userBaseSchema';

export const jwtUser = z.object({
  id: z.number(),
  email: z.string(),
  roles: roleSchema.array(),
});
