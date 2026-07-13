import { projectMemberBaseSchema } from '.';

export const projectMemberUpdateSchema = projectMemberBaseSchema
  .omit({
    id: true,
  })
  .partial();
