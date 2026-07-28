export {
  useTasksQuery,
  useTaskQuery,
  useCreateTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useRestoreTaskMutation,
} from './model/task-queries';

export type {
  ITask,
  ITaskIncludes,
  ITaskScopes,
  ICreateTaskDto,
  IUpdateTaskDto,
} from './model/task-api';
