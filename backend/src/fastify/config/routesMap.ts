import { tasksController } from '@/modules/tasks';
import { projectsController } from '@/modules/projects';
import { projectMembersController } from '@/modules/project-members';
import { usersController } from '@/modules/users';
import { RouteController } from '@/fastify/types';

export const routesMap: Record<string, RouteController> = {
  tasks: tasksController,
  projects: projectsController,
  'project-members': projectMembersController,
  users: usersController,
};
