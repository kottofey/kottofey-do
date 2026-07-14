import { FastifyRequest } from 'fastify';
import type { IncludeOptions, Includeable } from 'sequelize';

import {
  ProjectMembersModel,
  ProjectModel,
  RoleModel,
  TaskModel,
  UserModel,
} from '@/sequelize/models';
import type { CommonQuery } from '@/fastify/types';

export const INCLUDES_MAP = {
  Projects: { model: ProjectModel, as: 'projects' },
  Project: { model: ProjectModel, as: 'project' },
  Tasks: { model: TaskModel, as: 'tasks' },
  Users: { model: UserModel },
  Roles: { model: RoleModel },
  Members: { model: UserModel, as: 'members' },
  Owner: { model: UserModel, as: 'owner' },
  UserDetails: { model: UserModel, as: 'user_details' },
  ProjectDetails: { model: ProjectModel, as: 'project_details' },
  ProjectMembers: { model: ProjectMembersModel },
} as const satisfies Record<string, Omit<IncludeOptions, 'include'>>;

function parseIncludeString(includeStr: string): Includeable | null {
  const colonIndex = includeStr.indexOf(':');

  if (colonIndex === -1) {
    const key = includeStr.trim();
    return INCLUDES_MAP[key as keyof typeof INCLUDES_MAP];
  }

  const rootKey = includeStr.substring(0, colonIndex).trim();
  const nestedStr = includeStr.substring(colonIndex + 1);

  const rootConfig = INCLUDES_MAP[rootKey as keyof typeof INCLUDES_MAP];

  const nestedIncludes = nestedStr
    .split(',')
    .map(part => parseIncludeString(part.trim()))
    .filter((item): item is Includeable => item !== null);

  return {
    ...rootConfig,
    include: nestedIncludes,
  };
}

export const parseIncludes = (
  req: FastifyRequest<{ Querystring: CommonQuery }>,
): Includeable[] => {
  const rawIncludes = req.query.includes;
  if (!rawIncludes) return [];

  const combinedIncludes = rawIncludes.reduce<string[]>((acc, i) => {
    if (typeof i === 'string') return [...acc, ...i.split(',')];
    return [...acc, i];
  }, []);

  return combinedIncludes
    .map(str => parseIncludeString(str))
    .filter((item): item is Includeable => item !== null);
};

// СТАРОЕ!!

// import { FastifyRequest } from 'fastify';
// import type { Includeable } from 'sequelize';
//
// import { ProjectMembersModel, ProjectModel, TaskModel, UserModel } from '@/sequelize/models';
// import type { CommonQuery } from '@/fastify/types';
//
// const INCLUDES_MAP = {
//   Projects: { model: ProjectModel },
//   ProjectMembers: { model: ProjectMembersModel },
//   Tasks: { model: TaskModel },
//   Users: { model: UserModel },
//   Owner: {
//     as: 'owner',
//     model: UserModel,
//   },
//   Members: {
//     as: 'members',
//     model: UserModel,
//   },
// } as const satisfies Record<string, Includeable>;
//
// export const parseIncludes = (req: FastifyRequest<{ Querystring: CommonQuery }>): Includeable[] => {
//   const combinedIncludes = req.query.includes?.reduce<string[]>((acc, i) => {
//     if (typeof i === 'string') {
//       return [...acc, ...i.split(',')];
//     }
//
//     return [...acc, i];
//   }, []);
//
//   console.log(
//     combinedIncludes?.reduce<Includeable[]>((acc, i) => {
//       if (Object.keys(INCLUDES_MAP).includes(i)) {
//         return [...acc, INCLUDES_MAP[i as keyof typeof INCLUDES_MAP]];
//       }
//
//       return acc;
//     }, []) ?? [],
//   );
//   return (
//     combinedIncludes?.reduce<Includeable[]>((acc, i) => {
//       if (Object.keys(INCLUDES_MAP).includes(i)) {
//         return [...acc, INCLUDES_MAP[i as keyof typeof INCLUDES_MAP]];
//       }
//
//       return acc;
//     }, []) ?? []
//   );
// };
