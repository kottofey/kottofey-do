import type { IProject } from '@/entities/project';

export const getDoneAndTotalTasks = (project: IProject): [number, number] => {
  const totalTasks = project.tasks?.length ?? 0;
  const tasksDone = project.tasks?.filter((task) => task.is_done).length ?? 0;

  return [tasksDone, totalTasks];
};
