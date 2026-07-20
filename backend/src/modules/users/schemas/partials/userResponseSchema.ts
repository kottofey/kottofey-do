import { userBaseSchema } from '.';

export const userResponseSchema = userBaseSchema.omit({
  password_hash: true,
});
