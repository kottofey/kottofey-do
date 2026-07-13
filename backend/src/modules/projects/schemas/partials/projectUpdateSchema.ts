import { projectBaseSchema } from '.';

export const projectUpdateSchema = projectBaseSchema
  .omit({
    id: true,
  })
  .partial();
