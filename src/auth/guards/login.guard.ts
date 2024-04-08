import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authServise: AuthService) {}
  async canActivate(
    context: ExecutionContext,
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { username, password } = request.body;

    const user = await this.authServise.validateUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException(
        `Пользователя с ${username} не существует`,
      );
    }

    const comparedPassword = await compare(password, user.password);

    if (!comparedPassword) {
      throw new UnauthorizedException(`Пароль не подходит`);
    }

    return true;
  }
}
