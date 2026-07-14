import fs from 'fs/promises';
import { join } from 'node:path';

import dotenv from 'dotenv';
import { SequelizeOptions } from 'sequelize-typescript';
import chalk from 'chalk';

const envPath = join(process.cwd(), '.env');

const env = await fs.readFile(envPath, 'utf8');

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST_NAME,
  DB_PORT,
  NODE_ENV,
  SEQUELIZE_LOG,
} = dotenv.parse(env);

const options: SequelizeOptions = {
  dialect: 'mysql',
  host: DB_HOST_NAME || 'localhost',
  port: parseInt(DB_PORT || '3306'),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  timezone: '+03:00',
  // logging: true,
  logging: sql => {
    if (NODE_ENV === 'development' && SEQUELIZE_LOG === 'true') {
      console.log(chalk.gray(sql));
    }
  },
  define: {
    underscored: true,
    timestamps: true,
    paranoid: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  pool: {
    idle: 1000,
  },
};

export default options;
