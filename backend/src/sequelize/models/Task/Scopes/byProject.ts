export function byProject(project_id: number) {
  return {
    where: { project_id },
  };
}
