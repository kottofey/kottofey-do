import { taskBaseSchema } from '.';

export const taskUpdateSchema = taskBaseSchema
  .omit({
    id: true,
    owner_id: true,
  })
  .partial();
