import { z } from 'zod';

import { projectShortSchema } from '@/fastify/schemas/projects/partials/projectShortSchema';
import { taskShortSchema } from '@/fastify/schemas/tasks/partials/taskShortSchema';

export const userBaseSchema = z.object({
  id: z.number(),
  email: z.email(),

  projects: z.array(projectShortSchema).nullish(),
  tasks: z.array(taskShortSchema).nullish(),

  created_at: z.number(),
  updated_at: z.number(),
  deleted_at: z.number().nullish(),
});
