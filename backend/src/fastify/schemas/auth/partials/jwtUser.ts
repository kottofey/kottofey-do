import { z } from 'zod';

import { roleSchema } from '@/fastify/schemas/roleSchema';

export const jwtUser = z.object({
  id: z.number(),
  email: z.string(),
  roles: roleSchema
    .array()
    .transform(roles => roles.map(r => r.name))
    .or(z.string().array()),
});
