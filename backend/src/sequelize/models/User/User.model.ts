import {
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  NotNull,
  Table,
  HasMany,
  BelongsToMany,
  Scopes,
  DefaultScope,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { isAdmin } from './Scopes';

import {
  TaskModel,
  ProjectModel,
  ProjectMembersModel,
  RoleModel,
  UserRoleModel,
  RefreshTokenModel,
} from '@/sequelize/models';

@DefaultScope(() => ({
  attributes: {
    exclude: ['password_hash'],
  },
  include: { model: RoleModel, as: 'roles' },
}))
@Scopes(() => ({
  isAdmin,
}))
@Table({ paranoid: true, tableName: 'Users' })
export class UserModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER })
  declare id: number;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare email: string;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare password_hash?: string;

  @Column({
    type: DataTypes.DATE,
    get() {
      const value: unknown = this.getDataValue('created_at');
      return value instanceof Date ? value.getTime() : value;
    },
  })
  declare created_at: number;

  @Column({
    type: DataTypes.DATE,
    get() {
      const value: unknown = this.getDataValue('updated_at');
      return value instanceof Date ? value.getTime() : value;
    },
  })
  declare updated_at: number;

  @Column({
    type: DataTypes.DATE,
    get() {
      const value: unknown = this.getDataValue('deleted_at');
      return value instanceof Date ? value.getTime() : value;
    },
  })
  declare deleted_at: number;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------

  @HasMany(() => TaskModel, {
    as: 'tasks',
  })
  declare tasks: TaskModel[];

  @BelongsToMany(() => ProjectModel, {
    through: () => ProjectMembersModel,
    as: 'projects',
    otherKey: 'project_id',
    foreignKey: 'user_id',
  })
  declare projects: ProjectModel[];

  @BelongsToMany(() => RoleModel, {
    through: () => UserRoleModel,
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'roles',
  })
  declare roles: RoleModel[];

  @HasMany(() => RefreshTokenModel, {
    as: 'refreshTokens',
  })
  declare refreshTokens: RefreshTokenModel[];
}
