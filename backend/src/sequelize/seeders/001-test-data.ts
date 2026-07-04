import { Op, QueryInterface } from 'sequelize';

import type { SeederModule } from '@/sequelize/types';

import { sequelize } from '@/sequelize';

const users = [
  {
    id: 1,
    email: 'user1@mail.com',
    password_hash: 'lkwehflkowehfolike',
  },
  {
    id: 2,
    email: 'user2@mail.com',
    password_hash: '(*?asdyg?*(sagh)',
  },
];

const tasks = [
  {
    project_id: 1,
    owner_id: 1,
    title: 'Task 1 for user 1 project 1',
    priority: 'high',
    sort_order: 1000,
    is_done: false,
    is_archived: false,
  },
  {
    project_id: 1,
    owner_id: 1,
    title: 'Task 2 for user 1 project 1',
    priority: 'high',
    sort_order: 1000,
    is_done: false,
    is_archived: false,
  },
  {
    owner_id: 2,
    title: 'Task 1 for user 2 no project',
    sort_order: 1000,
    priority: 'normal',
    is_done: false,
    is_archived: false,
  },
  {
    owner_id: 2,
    title: 'Task 2 for user 1 no project',
    sort_order: 1000,
    priority: 'normal',
    is_done: false,
    is_archived: false,
  },
  {
    owner_id: 2,
    title: 'Task 3 for user 1 no project',
    sort_order: 1000,
    priority: 'normal',
    is_done: false,
    is_archived: false,
  },
];

const projects = [
  {
    owner_id: 1,
    name: 'Project 1',
    is_archived: false,
  },
];

const project_members = [
  {
    project_id: 1,
    user_id: 1,
    role: 'owner',
  },
  {
    project_id: 1,
    user_id: 2,
    role: 'editor',
  },
];

const seeder: SeederModule = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction1 = await sequelize.transaction();
    const transaction2 = await sequelize.transaction();

    try {
      await queryInterface.bulkInsert('Users', users, { transaction: transaction1 });
      await transaction1.commit();

      await queryInterface.bulkInsert('Projects', projects, { transaction: transaction2 });
      await queryInterface.bulkInsert('ProjectMembers', project_members, {
        transaction: transaction2,
      });
      await queryInterface.bulkInsert('Tasks', tasks, { transaction: transaction2 });

      await transaction2.commit();
    } catch (e) {
      console.error(e);
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      await queryInterface.bulkDelete(
        'Tasks',
        {
          [Op.or]: tasks,
        },
        { transaction },
      );

      await queryInterface.bulkDelete(
        'ProjectMembers',
        {
          [Op.or]: project_members,
        },
        { transaction },
      );

      await queryInterface.bulkDelete(
        'Projects',
        {
          [Op.or]: projects,
        },
        { transaction },
      );

      await queryInterface.bulkDelete(
        'Users',
        {
          [Op.or]: users,
        },
        { transaction },
      );

      await transaction.commit();
    } catch (e) {
      console.error(e);
    }
  },
};

export default seeder;
