import { z } from 'zod';

import { projectShortSchema } from '../../../projects/schemas/partials';
import { userShortSchema } from '../../../users/schemas/partials';

export const projectMemberBaseSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  user_id: z.number(),
  role: z.enum(['owner', 'editor', 'viewer']),

  user_details: userShortSchema.nullish(),
  project_details: projectShortSchema.nullish(),

  created_at: z.number(),
  updated_at: z.number(),
  deleted_at: z.number().nullish(),
});
