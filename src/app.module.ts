import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    AuthModule,
    TasksModule
  ]
})
export class AppModule {}
