import dayjs from 'dayjs';
import { z } from 'zod';

import { userBaseSchema } from '.';

export const userCreateSchema = userBaseSchema
  .omit({
    id: true,
  })
  .extend({
    password: z.string().min(5),

    created_at: userBaseSchema.shape.created_at.default(dayjs().valueOf()),
    updated_at: userBaseSchema.shape.updated_at.default(dayjs().valueOf()),
  })
  .strict();
