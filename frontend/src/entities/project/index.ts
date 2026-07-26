export {
  useProjectsQuery,
  useProjectQuery,
  useCreateProjectMutation,
  useEditProjectMutation,
  useDeleteProjectMutation,
  useRestoreProjectMutation,

  // Для разовых запросов
  useProjectsQueryClient,
} from './model/project-queries';

export type {
  IProject,
  IProjectIncludes,
  IProjectScopes,
} from './model/project-api';
