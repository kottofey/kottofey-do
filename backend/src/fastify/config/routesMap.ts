import { tasksController } from '@/modules/tasks';
import { projectsController } from '@/modules/projects';
import { usersController } from '@/modules/users';
import { RouteController } from '@/fastify/types';

// import { projectMembersController } from '@/modules/project-members';

export const routesMap: Record<string, RouteController> = {
  tasks: tasksController,
  projects: projectsController,
  // 'project-members': projectMembersController,
  users: usersController,
};
