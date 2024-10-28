import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface LoginPayload {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: LoginPayload) {
    const user = await this.usersService.findByUsername(payload.username);
    if (user && (await bcrypt.compare(payload.password, user.password))) {
      return {
        id: user.id,
        username: user.username,
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const token = this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
    return { access_token: token };
  }
}
