import dayjs from 'dayjs';

import { projectBaseSchema } from '.';

export const projectCreateSchema = projectBaseSchema
  .omit({
    id: true,
    owner_id: true,
    tasks: true,
  })
  .extend({
    is_archived: projectBaseSchema.shape.is_archived.default(false),
    created_at: projectBaseSchema.shape.created_at.default(dayjs().valueOf()),
    updated_at: projectBaseSchema.shape.updated_at.default(dayjs().valueOf()),
  })
  .strict();
