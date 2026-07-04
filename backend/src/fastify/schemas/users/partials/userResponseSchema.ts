import dayjs from 'dayjs';

import { userBaseSchema } from './userBaseSchema';

export const userResponseSchema = userBaseSchema.extend({
  created_at: userBaseSchema.shape.created_at.default(dayjs().valueOf()),
  updated_at: userBaseSchema.shape.updated_at.default(dayjs().valueOf()),
});
