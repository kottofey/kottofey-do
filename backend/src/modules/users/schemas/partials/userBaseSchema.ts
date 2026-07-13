import { z } from 'zod';

import { projectShortSchema } from '../../../projects/schemas/partials/projectShortSchema';
import { taskShortSchema } from '../../../tasks/schemas/partials/taskShortSchema';

const roleSchema = z.object({
  name: z.string(),
  // description: z.string().nullish(),
});

export const userBaseSchema = z.object({
  id: z.number(),
  email: z.email(),
  password_hash: z.string().nullish(),

  projects: z.array(projectShortSchema).nullish(),
  tasks: z.array(taskShortSchema).nullish(),
  roles: roleSchema
    .array()
    .transform(roles => roles.map(r => r.name))
    .or(z.string().array()),

  created_at: z.number(),
  updated_at: z.number(),
  deleted_at: z.number().nullish(),
});
