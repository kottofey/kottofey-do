import dayjs from 'dayjs';

import { roleBaseSchema } from '.';

export const roleUpdateSchema = roleBaseSchema
  .omit({
    id: true,
    deleted_at: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    updated_at: roleBaseSchema.shape.updated_at.default(dayjs().valueOf()),
  })
  .partial();
