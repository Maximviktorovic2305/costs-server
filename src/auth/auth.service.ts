import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByUsername(username: string): Promise<User | null> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      return null;
    }

    return user;
  }

  async validateUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      return null;
    }

    return user;
  }

  async generateAccessToken(user: User) {
    return {
      access_token: this.jwtService.sign({ user }),
    };
  }

  async generateRefreshToken(userId: string) {
    return {
      refresh_token: this.jwtService.sign(
        { userId },
        { secret: jwtConstants.secret, expiresIn: '30d' },
      ),
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return { error: error.message };
    }
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  }

  getUserByToken(token: string): Promise<User> {
    const parsedToken = this.parseJwt(token);

    return this.usersService.findOne(parsedToken.user.username);
  }
}
