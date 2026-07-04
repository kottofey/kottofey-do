import {
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { RoleModel, RolePermissionModel } from '@/sequelize/models';

@Table({ tableName: 'Permissions', timestamps: true, underscored: true })
export class PermissionModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER })
  declare id: number;

  @Column({ type: DataTypes.STRING, allowNull: false, unique: true })
  declare name: string; // e.g., 'task:create', 'user:delete'

  @Column({ type: DataTypes.STRING })
  declare description?: string;

  // Relations
  @BelongsToMany(() => RoleModel, {
    through: () => RolePermissionModel,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
  })
  declare roles: RoleModel[];
}
