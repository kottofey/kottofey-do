import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize-typescript';
import type { Migration } from '@/lib/umzug';

export const up: Migration = async ({ context: sequelize }: { context: Sequelize }) => {
  const transaction = await sequelize.transaction();

  try {
    // Projects -> Users (owner_id)
    await sequelize.getQueryInterface().addConstraint('Projects', {
      transaction,
      name: 'projects_ownerFK',
      type: 'foreign key',
      references: {
        field: 'id',
        table: 'Users',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      fields: ['owner_id'],
    });

    // Tasks -> Projects (project_id)
    await sequelize.getQueryInterface().addConstraint('Tasks', {
      transaction,
      name: 'tasks_projectFK',
      type: 'foreign key',
      references: {
        field: 'id',
        table: 'Projects',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      fields: ['project_id'],
    });

    // Tasks -> Users (owner_id)
    await sequelize.getQueryInterface().addConstraint('Tasks', {
      transaction,
      name: 'tasks_ownerFK',
      type: 'foreign key',
      references: {
        field: 'id',
        table: 'Users',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      fields: ['owner_id'],
    });

    // ProjectMembers -> Projects (project_id)
    await sequelize.getQueryInterface().addConstraint('ProjectMembers', {
      transaction,
      name: 'members_projectFK',
      type: 'foreign key',
      references: {
        field: 'id',
        table: 'Projects',
      },
      onDelete: 'CASCADE', // Логичнее CASCADE: удалили проект -> удалились участники
      onUpdate: 'CASCADE',
      fields: ['project_id'],
    });

    // ProjectMembers -> Users (user_id)
    await sequelize.getQueryInterface().addConstraint('ProjectMembers', {
      transaction,
      name: 'members_userFK',
      type: 'foreign key',
      references: {
        field: 'id',
        table: 'Users',
      },
      onDelete: 'CASCADE', // Логичнее CASCADE: удалили юзера -> удалилось его членство
      onUpdate: 'CASCADE',
      fields: ['user_id'],
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
    // Projects
    await sequelize
      .getQueryInterface()
      .removeConstraint('Projects', 'projects_ownerFK', { transaction });

    // Tasks
    await sequelize
      .getQueryInterface()
      .removeConstraint('Tasks', 'tasks_projectFK', { transaction });
    await sequelize.getQueryInterface().removeConstraint('Tasks', 'tasks_ownerFK', { transaction });

    // ProjectMembers
    await sequelize
      .getQueryInterface()
      .removeConstraint('ProjectMembers', 'members_projectFK', { transaction });
    await sequelize
      .getQueryInterface()
      .removeConstraint('ProjectMembers', 'members_userFK', { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
