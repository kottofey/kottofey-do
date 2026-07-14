import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '@/lib/umzug';

export const up: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable(
      'Projects',
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        owner_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        name: {
          type: DataTypes.STRING,
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

export const down: Migration = async ({
  context: sequelize,
}: {
  context: Sequelize;
}) => {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.getQueryInterface().dropTable('Projects', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
