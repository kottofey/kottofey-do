import { tasksController } from './tasks';
import { projectsController } from './projects';
import { projectMembersController } from './project-members';
import { usersController } from './users';
import { authController } from './auth';

import { RouteController } from '@/fastify/types';

export const routesMap: Record<string, RouteController> = {
  tasks: tasksController,
  projects: projectsController,
  'project-members': projectMembersController,
  users: usersController,
  auth: authController,
};
