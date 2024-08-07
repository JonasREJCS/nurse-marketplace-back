import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { sign, verify } from './utils/jwt.utils';
import { JwtPayload } from './models/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly secretKey = process.env.JWT_SECRET;

  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email };
    return {
      access_token: sign(payload, this.secretKey),
    };
  }

  async verifyToken(token: string) {
    try {
      return verify(token, this.secretKey);
    } catch (error) {
      return null;
    }
  }
}
