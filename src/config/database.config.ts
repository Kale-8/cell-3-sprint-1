import { DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const dbType = process.env.DB_TYPE || 'sqlite';

export const databaseConfig: DataSourceOptions = dbType === 'postgres'
  ? {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'task_manager',
      entities: [User, Task],
      synchronize: true
    }
  : {
      type: 'sqlite',
      database: process.env.SQLITE_FILENAME || './data/dev.sqlite',
      entities: [User, Task],
      synchronize: true
    };
