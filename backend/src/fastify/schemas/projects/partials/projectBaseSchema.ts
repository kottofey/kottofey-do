import { z } from 'zod';

import { taskShortSchema } from '@/fastify/schemas/tasks/partials/taskShortSchema';
import { userShortSchema } from '@/fastify/schemas/users/partials/userShortSchema';

export const projectBaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  owner_id: z.number(),
  is_archived: z.boolean(),
  created_at: z.number(),
  updated_at: z.number(),

  owner: userShortSchema.nullish(),
  tasks: z.array(taskShortSchema).nullish(),
  members: z.array(userShortSchema).nullish(),
});
