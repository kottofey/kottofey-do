// export * from './services/ProjectService';
// export * from './repositories/ProjectRepository';
// export * from './projectsController';
// export * from './handlers';
// export * from './schemas/projectSchema';
// export * from './schemas/partials';

import { ProjectRepository } from './repositories/ProjectRepository';
import { ProjectService } from './services/ProjectService';

const projectRepository = new ProjectRepository();
export const projectService = new ProjectService(projectRepository);

export { projectsController } from './projectsController';
