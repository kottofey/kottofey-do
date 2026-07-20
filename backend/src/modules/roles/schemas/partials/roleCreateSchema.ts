import dayjs from 'dayjs';

import { roleBaseSchema } from '.';

export const roleCreateSchema = roleBaseSchema
  .omit({
    id: true,
  })
  .extend({
    created_at: roleBaseSchema.shape.created_at.default(dayjs().valueOf()),
    updated_at: roleBaseSchema.shape.updated_at.default(dayjs().valueOf()),
  })
  .strict();
