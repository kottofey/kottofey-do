import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '@/lib/umzug';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'Tasks',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        project_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        owner_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        priority: {
          type: DataTypes.ENUM('high', 'normal', 'low'),
          defaultValue: 'normal',
          allowNull: false,
        },

        sort_order: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        is_done: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

        is_archived: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },

        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.fn('NOW'),
        },
        deleted_at: {
          type: DataTypes.DATE,
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: sequelize.fn('NOW'),
        },
      },
      {
        transaction,
      },
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
    await sequelize.getQueryInterface().dropTable('Tasks', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
