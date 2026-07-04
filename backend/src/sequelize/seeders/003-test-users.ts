import { QueryInterface } from 'sequelize';
import type { SeederModule } from '@/sequelize/types';
import { sequelize } from '@/sequelize';
import bcrypt from 'bcrypt';

const seeder: SeederModule = {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      const passwordHash = await bcrypt.hash('password123', 10);
      
      const users = [
        { id: 10, email: 'admin@todo.com', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() },
        { id: 11, email: 'user@todo.com', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() },
        { id: 12, email: 'guest@todo.com', password_hash: passwordHash, created_at: new Date(), updated_at: new Date() },
      ];

      await queryInterface.bulkInsert('Users', users, { transaction });

      const userRoles = [
        { user_id: 10, role_id: 1, created_at: new Date(), updated_at: new Date() }, // admin
        { user_id: 11, role_id: 2, created_at: new Date(), updated_at: new Date() }, // user
        { user_id: 12, role_id: 3, created_at: new Date(), updated_at: new Date() }, // guest
      ];

      await queryInterface.bulkInsert('UserRoles', userRoles, { transaction });
      
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
      await queryInterface.bulkDelete('UserRoles', { user_id: [10, 11, 12] }, { transaction });
      await queryInterface.bulkDelete('Users', { id: [10, 11, 12] }, { transaction });
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      console.error(e);
      throw e;
    }
  },
};

export default seeder;
