import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';

import type { Migration } from '@/lib/umzug';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.getQueryInterface().addIndex('ProjectMembers', ['project_id'], {
      transaction,
      name: 'projectMembers-project_id',
    });

    await sequelize
      .getQueryInterface()
      .addIndex('ProjectMembers', ['user_id'], { transaction, name: 'projectMembers-user_id' });

    await sequelize.getQueryInterface().addConstraint('ProjectMembers', {
      fields: ['project_id'],
      type: 'foreign key',
      name: 'fk_project_members_project',
      references: {
        table: 'Projects',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
    });

    // Foreign key для user_id
    await sequelize.getQueryInterface().addConstraint('ProjectMembers', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_project_members_user',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      transaction,
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
    await sequelize
      .getQueryInterface()
      .removeConstraint('ProjectMembers', 'fk_project_members_project', { transaction });
    await sequelize
      .getQueryInterface()
      .removeConstraint('ProjectMembers', 'fk_project_members_user', { transaction });

    await sequelize
      .getQueryInterface()
      .removeIndex('ProjectMembers', 'projectMembers-project_id', { transaction });
    await sequelize
      .getQueryInterface()
      .removeIndex('ProjectMembers', 'projectMembers-user_id', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
