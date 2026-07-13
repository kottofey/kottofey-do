import { z } from 'zod';

import { taskShortSchema } from '../../../tasks/schemas/partials';
import { userShortSchema } from '../../../users/schemas/partials';

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
