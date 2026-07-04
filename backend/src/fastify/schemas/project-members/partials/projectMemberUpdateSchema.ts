import { projectMemberBaseSchema } from '@/fastify/schemas';

export const projectMemberUpdateSchema = projectMemberBaseSchema
  .omit({
    id: true,
  })
  .partial();
