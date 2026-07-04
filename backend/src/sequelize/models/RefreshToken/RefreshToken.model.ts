import {
  AutoIncrement,
  PrimaryKey,
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { UserModel } from '@/sequelize/models';

@Table({ tableName: 'RefreshTokens', timestamps: true, underscored: true })
export class RefreshTokenModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataTypes.INTEGER })
  declare id: number;

  @Column({ type: DataTypes.TEXT, allowNull: false })
  declare token: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare user_id: number;

  @Column({ type: DataTypes.DATE, allowNull: false })
  declare expires_at: Date;

  @Column({ type: DataTypes.STRING })
  declare user_agent?: string;

  @Column({ type: DataTypes.STRING })
  declare ip_address?: string;

  @BelongsTo(() => UserModel)
  declare user: UserModel;
}
