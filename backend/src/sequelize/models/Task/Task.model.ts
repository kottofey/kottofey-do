import {
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  NotNull,
  Table,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  Scopes,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { byIds, byOwner, byStatus, onlyArchived, byProject } from './Scopes';

import { ProjectModel, UserModel } from '@/sequelize/models';

@Scopes(() => ({
  byStatus,
  onlyArchived,
  byIds,
  byOwner,
  byProject,
}))
@Table({ paranoid: true, tableName: 'Tasks' })
export class TaskModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER })
  declare id: number;

  @AllowNull
  @ForeignKey(() => ProjectModel)
  @Column({ type: DataTypes.INTEGER })
  declare project_id: number;

  @NotNull
  @ForeignKey(() => UserModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare owner_id: number;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare title: string;

  @NotNull
  @Default('normal')
  @Column({
    type: DataTypes.ENUM('high', 'normal', 'low'),
    allowNull: false,
    defaultValue: 'normal',
  })
  declare priority: 'high' | 'normal' | 'low';

  @AllowNull
  @Column({ type: DataTypes.INTEGER })
  declare sort_order: number;

  @NotNull
  @Default(false)
  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  declare is_done: boolean;

  @NotNull
  @Default(false)
  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  declare is_archived: boolean;

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

  @BelongsTo(() => ProjectModel, { as: 'project' })
  declare project: ProjectModel;

  @BelongsTo(() => UserModel, { as: 'owner' })
  declare owner: UserModel;
}
