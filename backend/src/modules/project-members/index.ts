// export * from './services/ProjectMemberService';
// export * from './repositories/ProjectMemberRepository';
// export * from './projectMembersController';
// export * from './handlers';
// export * from './schemas/projectMemberSchema';
// export * from './schemas/partials';

import { ProjectMemberRepository } from './repositories/ProjectMemberRepository';
import { ProjectMemberService } from './services/ProjectMemberService';

const projectMemberRepository = new ProjectMemberRepository();
export const projectMemberService = new ProjectMemberService(projectMemberRepository);

export { projectMembersController } from './projectMembersController';
