import dayjs from 'dayjs';

import { taskBaseSchema } from './taskBaseSchema';

export const taskCreateSchema = taskBaseSchema
  .omit({
    id: true,
  })
  .extend({
    priority: taskBaseSchema.shape.priority.default('normal'),
    is_done: taskBaseSchema.shape.is_done.default(false),
    is_archived: taskBaseSchema.shape.is_archived.default(false),
    created_at: taskBaseSchema.shape.created_at.default(dayjs().valueOf()),
    updated_at: taskBaseSchema.shape.updated_at.default(dayjs().valueOf()),
  })
  .strict();
