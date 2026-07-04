import {
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  NotNull,
  Table,
  ForeignKey,
  Scopes,
  BelongsTo,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { byUser, byProject } from './Scopes';

import { UserModel, ProjectModel } from '@/sequelize/models';

@Scopes(() => ({
  byUser,
  byProject,
}))
@Table({
  paranoid: true,
  tableName: 'ProjectMembers',
})
export class ProjectMembersModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER })
  declare id: number;

  @NotNull
  @ForeignKey(() => ProjectModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare project_id: number;

  @NotNull
  @ForeignKey(() => UserModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare user_id: number;

  @NotNull
  @Column({ type: DataTypes.ENUM('owner', 'editor', 'viewer'), allowNull: false })
  declare role: 'owner' | 'editor' | 'viewer';

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

  @BelongsTo(() => UserModel, { as: 'user_details', foreignKey: 'user_id' })
  declare user_details: UserModel;

  @BelongsTo(() => ProjectModel, { as: 'project_details', foreignKey: 'project_id' })
  declare project_details: ProjectModel;
}
