import { Sequelize } from 'sequelize-typescript';

import options from './seqOptions';

import {
  TaskModel,
  UserModel,
  ProjectMembersModel,
  ProjectModel,
  SeederModel,
  PermissionModel,
  RefreshTokenModel,
  RoleModel,
  RolePermissionModel,
  UserRoleModel,
} from '@/sequelize/models';

const sequelize = new Sequelize({
  ...options,
  models: [
    TaskModel,
    UserModel,
    ProjectMembersModel,
    ProjectModel,
    SeederModel,
    PermissionModel,
    RefreshTokenModel,
    RoleModel,
    RolePermissionModel,
    UserRoleModel,
  ],
});

export { sequelize };
