import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change_me',
    });
  }

  async validate(payload: any) {
    // payload.sub = userId
    const user = await this.usersService.findById(payload.sub);
    // Return value attached to req.user
    return { id: user.id, email: user.email, username: user.username };
  }
}

