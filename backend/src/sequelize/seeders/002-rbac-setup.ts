import { QueryInterface } from 'sequelize';
import type { SeederModule } from '@/sequelize/types';
import { sequelize } from '@/sequelize';

const roles = [
  {
    id: 1,
    name: 'admin',
    description: 'Administrator with full access',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'user',
    description: 'Regular user',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'guest',
    description: 'Guest user with read-only access',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const permissions = [
  {
    id: 1,
    name: 'task:create',
    description: 'Create tasks',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: 'task:read',
    description: 'Read tasks',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: 'task:update',
    description: 'Update tasks',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    name: 'task:delete',
    description: 'Delete tasks',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    name: 'task:restore',
    description: 'Restore tasks',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    name: 'project:create',
    description: 'Create projects',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 7,
    name: 'project:read',
    description: 'Read projects',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 8,
    name: 'project:update',
    description: 'Update projects',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 9,
    name: 'project:delete',
    description: 'Delete projects',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 10,
    name: 'project:restore',
    description: 'Restore projects',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 11,
    name: 'user:read',
    description: 'Read users',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 12,
    name: 'user:create',
    description: 'Create users',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 13,
    name: 'user:update',
    description: 'Update users',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 14,
    name: 'user:delete',
    description: 'Delete users',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 15,
    name: 'user:restore',
    description: 'Restore users',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 16,
    name: 'project-member:create',
    description: 'Create project members',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 17,
    name: 'project-member:read',
    description: 'Read project members',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 18,
    name: 'project-member:update',
    description: 'Update project members',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 19,
    name: 'project-member:delete',
    description: 'Delete project members',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 20,
    name: 'project-member:restore',
    description: 'Restore project members',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const rolePermissions = [
  // Admin has all permissions
  ...permissions.map(p => ({
    role_id: 1,
    permission_id: p.id,
    created_at: new Date(),
    updated_at: new Date(),
  })),
  // User permissions
  { role_id: 2, permission_id: 1, created_at: new Date(), updated_at: new Date() }, // task:create
  { role_id: 2, permission_id: 2, created_at: new Date(), updated_at: new Date() }, // task:read
  { role_id: 2, permission_id: 3, created_at: new Date(), updated_at: new Date() }, // task:update
  { role_id: 2, permission_id: 4, created_at: new Date(), updated_at: new Date() }, // task:delete
  { role_id: 2, permission_id: 5, created_at: new Date(), updated_at: new Date() }, // task:restore
  { role_id: 2, permission_id: 6, created_at: new Date(), updated_at: new Date() }, // project:create
  { role_id: 2, permission_id: 7, created_at: new Date(), updated_at: new Date() }, // project:read
  { role_id: 2, permission_id: 8, created_at: new Date(), updated_at: new Date() }, // project:update
  { role_id: 2, permission_id: 9, created_at: new Date(), updated_at: new Date() }, // project:delete
  { role_id: 2, permission_id: 10, created_at: new Date(), updated_at: new Date() }, // project:restore
  { role_id: 2, permission_id: 11, created_at: new Date(), updated_at: new Date() }, // user:read
  { role_id: 2, permission_id: 13, created_at: new Date(), updated_at: new Date() }, // user:update - только себя
  { role_id: 2, permission_id: 16, created_at: new Date(), updated_at: new Date() }, // project-member:create
  { role_id: 2, permission_id: 17, created_at: new Date(), updated_at: new Date() }, // project-member:read
  { role_id: 2, permission_id: 18, created_at: new Date(), updated_at: new Date() }, // project-member:update
  { role_id: 2, permission_id: 19, created_at: new Date(), updated_at: new Date() }, // project-member:delete
  { role_id: 2, permission_id: 20, created_at: new Date(), updated_at: new Date() }, // project-member:restore
  // Guest permissions
  { role_id: 3, permission_id: 2, created_at: new Date(), updated_at: new Date() }, // task:read
  { role_id: 3, permission_id: 7, created_at: new Date(), updated_at: new Date() }, // project:read
  { role_id: 3, permission_id: 17, created_at: new Date(), updated_at: new Date() }, // project-member:read
];

const seeder: SeederModule = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await queryInterface.bulkInsert('Roles', roles, { transaction });
      await queryInterface.bulkInsert('Permissions', permissions, { transaction });
      await queryInterface.bulkInsert('RolePermissions', rolePermissions, { transaction });
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      console.error(e);
      throw e;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await queryInterface.bulkDelete('RolePermissions', {}, { transaction });
      await queryInterface.bulkDelete('Permissions', {}, { transaction });
      await queryInterface.bulkDelete('Roles', {}, { transaction });
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      console.error(e);
      throw e;
    }
  },
};

export default seeder;
