import { z } from 'zod';

import { taskShortSchema } from '@/fastify/schemas/tasks/partials/taskShortSchema';

export const userShortSchema = z.object({
  id: z.number(),
  email: z.string(),

  tasks: z.array(taskShortSchema).nullish(),
});
