import { QueryInterface } from 'sequelize';

export interface SeederModule {
  up?: (queryInterface: QueryInterface) => Promise<void>;
  down?: (queryInterface: QueryInterface) => Promise<void>;
}
