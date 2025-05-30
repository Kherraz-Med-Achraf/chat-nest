import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}


  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id || user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: { username: string, email: string, password: string }) {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({
      ...dto,
      password: hashed,
    });
  }
}
