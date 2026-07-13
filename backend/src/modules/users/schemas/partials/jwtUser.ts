import { z } from 'zod';

const roleSchema = z.object({
  name: z.string(),
  // description: z.string().nullish(),
});

export const jwtUser = z.object({
  id: z.number(),
  email: z.string(),
  roles: roleSchema
    .array()
    .transform(roles => roles.map(r => r.name))
    .or(z.string().array()),
});
