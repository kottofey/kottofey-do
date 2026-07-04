import { z } from 'zod';

import { userShortSchema } from '@/fastify/schemas/users/partials/userShortSchema';

export const projectShortSchema = z.object({
  id: z.number(),
  name: z.string(),
  owner_id: z.number(),
  is_archived: z.boolean(),

  members: z.array(userShortSchema).nullish(),
});
