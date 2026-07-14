import {
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import {
  UserModel,
  PermissionModel,
  RolePermissionModel,
  UserRoleModel,
} from '@/sequelize/models';

@Table({ tableName: 'Roles', timestamps: true, underscored: true })
export class RoleModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER })
  declare id: number;

  @Column({ type: DataTypes.STRING, allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataTypes.STRING })
  declare description?: string;

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

  // Relations
  @BelongsToMany(() => UserModel, {
    through: () => UserRoleModel,
    foreignKey: 'role_id',
    otherKey: 'user_id',
  })
  declare users: UserModel[];

  @BelongsToMany(() => PermissionModel, {
    through: () => RolePermissionModel,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
  })
  declare permissions: PermissionModel[];
}
