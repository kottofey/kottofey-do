export {
  useProjectsQuery,
  useProjectQuery,
  useCreateProjectMutation,
  useEditProjectMutation,
  useDeleteProjectMutation,
  useRestoreProjectMutation,
} from './model/project-queries';

export type {
  IProject,
  IProjectIncludes,
  IProjectScopes,
} from './model/project-api';
