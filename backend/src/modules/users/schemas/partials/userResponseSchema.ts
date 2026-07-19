import { z } from 'zod';

import { userBaseSchema } from '.';

export const userResponseSchema = userBaseSchema
  .omit({
    password_hash: true,
  })
  .extend({
    roles: z.string().array(),
  });
