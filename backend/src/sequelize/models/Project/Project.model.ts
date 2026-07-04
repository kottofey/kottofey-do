import {
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  NotNull,
  Table,
  Default,
  BelongsTo,
  ForeignKey,
  HasMany,
  BelongsToMany,
  Scopes,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { byOwner } from './Scopes';

import { UserModel, TaskModel, ProjectMembersModel } from '@/sequelize/models';

@Scopes(() => ({
  byOwner,
}))
@Table({ paranoid: true, tableName: 'Projects' })
export class ProjectModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER })
  declare id: number;

  @NotNull
  @ForeignKey(() => UserModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare owner_id: number;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare name: string;

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

  @BelongsTo(() => UserModel, { as: 'owner', foreignKey: 'owner_id' })
  declare owner: UserModel;

  @HasMany(() => TaskModel, { as: 'tasks' })
  declare tasks: TaskModel[];

  @BelongsToMany(() => UserModel, {
    through: () => ProjectMembersModel,
    as: 'members',
    otherKey: 'user_id',
    foreignKey: 'project_id',
  })
  declare members: UserModel[];
}
