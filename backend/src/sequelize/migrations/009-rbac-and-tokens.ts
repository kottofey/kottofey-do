import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';
import type { Migration } from '@/lib/umzug';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    // Roles table
    await sequelize.getQueryInterface().createTable(
      'Roles',
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.STRING },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
      },
      { transaction },
    );

    // Permissions table
    await sequelize.getQueryInterface().createTable(
      'Permissions',
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.STRING },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
      },
      { transaction },
    );

    // RolePermissions table
    await sequelize.getQueryInterface().createTable(
      'RolePermissions',
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Roles', key: 'id' },
          onDelete: 'CASCADE',
        },
        permission_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Permissions', key: 'id' },
          onDelete: 'CASCADE',
        },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
      },
      { transaction },
    );

    // UserRoles table
    await sequelize.getQueryInterface().createTable(
      'UserRoles',
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' },
          onDelete: 'CASCADE',
        },
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Roles', key: 'id' },
          onDelete: 'CASCADE',
        },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
      },
      { transaction },
    );

    // RefreshTokens table
    await sequelize.getQueryInterface().createTable(
      'RefreshTokens',
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        token: { type: DataTypes.TEXT, allowNull: false },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' },
          onDelete: 'CASCADE',
        },
        expires_at: { type: DataTypes.DATE, allowNull: false },
        user_agent: { type: DataTypes.STRING },
        ip_address: { type: DataTypes.STRING },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
        deleted_at: { type: DataTypes.DATE, allowNull: true },
      },
      { transaction },
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.getQueryInterface().dropTable('RefreshTokens', { transaction });
    await sequelize.getQueryInterface().dropTable('UserRoles', { transaction });
    await sequelize.getQueryInterface().dropTable('RolePermissions', { transaction });
    await sequelize.getQueryInterface().dropTable('Permissions', { transaction });
    await sequelize.getQueryInterface().dropTable('Roles', { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
