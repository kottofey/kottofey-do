import {
  Column,
  Model,
  Table,
  ForeignKey,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { RoleModel, PermissionModel } from '@/sequelize/models';

@Table({ tableName: 'RolePermissions', timestamps: true, underscored: true })
export class RolePermissionModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER })
  declare id: number;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare role_id: number;

  @ForeignKey(() => PermissionModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare permission_id: number;

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
}
