import type { IProject } from '@/entities/project';

export const getPercentageDone = (project: IProject) => {
  const totalTasks = project.tasks?.length;

  if (!totalTasks || totalTasks === 0) {
    return 0;
  }

  const tasksDone = project.tasks?.filter((task) => task.is_done).length ?? 0;

  return Math.floor((tasksDone / totalTasks) * 100);
};
