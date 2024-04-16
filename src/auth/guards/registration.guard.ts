import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class RegistrationGuard implements CanActivate {
  constructor(private authServise: AuthService) {}
  async canActivate(
    context: ExecutionContext,
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { username, email } = request.body;

    const userByUsername =
      await this.authServise.validateUserByUsername(username);   
      
    const userByEmail = await this.authServise.validateUserByEmail(email);

    if (userByUsername) {
      throw new UnauthorizedException(
        `Пользователь ${username} уже существует`,
      );
    }

    if (userByEmail) {
      throw new UnauthorizedException(`Пользователь ${email} уже существует`);
    }

    return true;
  }
}
