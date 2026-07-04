import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '@/lib/umzug';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().createTable('Seeders', {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      executed_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW'),
      },
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const down: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.getQueryInterface().dropTable('Seeders', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
