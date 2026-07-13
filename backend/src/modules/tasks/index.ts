// export * from './services/TaskService';
// export * from './repositories/TaskRepository';
// export * from './tasksController';
// export * from './handlers';
// export * from './schemas/taskSchema';
// export * from './schemas/partials';

import { TaskRepository } from './repositories/TaskRepository';
import { TaskService } from './services/TaskService';

const taskRepository = new TaskRepository();

export const taskService = new TaskService(taskRepository);
export { tasksController } from './tasksController';
