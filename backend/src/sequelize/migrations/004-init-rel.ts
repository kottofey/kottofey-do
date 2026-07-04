import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '@/lib/umzug';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addConstraint('Projects', {
      transaction,
      name: 'ownerFK',
      type: 'foreign key',
      references: {
        field: 'id',
        table: 'Users',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      fields: ['owner_id'],
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
    await sequelize.getQueryInterface().removeConstraint('Projects', 'ownerFK', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
