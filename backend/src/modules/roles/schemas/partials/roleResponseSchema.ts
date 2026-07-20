import { roleBaseSchema } from '.';

export const roleResponseSchema = roleBaseSchema.omit({
  created_at: true,
  updated_at: true,
  deleted_at: true,
});
