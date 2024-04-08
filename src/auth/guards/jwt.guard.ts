import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authServise: AuthService) {}
  async canActivate(
    context: ExecutionContext,
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Ошибка авторизации');
    }

    const validToken = this.authServise.verifyToken(token);

    if (validToken.error) {
      throw new UnauthorizedException(validToken.error);
    }   

    return request.token = token   
  }
}
