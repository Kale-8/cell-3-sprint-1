import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import * as dotenv from 'dotenv';
dotenv.config();

const jwtExpiration = process.env.JWT_EXPIRATION
  ? (isNaN(Number(process.env.JWT_EXPIRATION))
      ? (process.env.JWT_EXPIRATION as any)
      : Number(process.env.JWT_EXPIRATION))
  : '1d';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_me',
      signOptions: { expiresIn: jwtExpiration }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}

