import dayjs from 'dayjs';

import { projectMemberBaseSchema } from '@/fastify/schemas';

export const projectMemberCreateSchema = projectMemberBaseSchema
  .omit({
    id: true,
  })
  .extend({
    created_at: projectMemberBaseSchema.shape.created_at.default(dayjs().valueOf()),
    updated_at: projectMemberBaseSchema.shape.updated_at.default(dayjs().valueOf()),
  })
  .strict();
