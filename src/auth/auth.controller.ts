import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginGuard } from './guards/login.guard';
import { RefreshJwtGuard } from './guards/refreshJwt.guard';
import { RegistrationGuard } from './guards/registration.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersServise: UsersService,
  ) {}

  @Post('/registration')
  @UseGuards(RegistrationGuard)
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.usersServise.registration(createUserDto);

    res.statusCode = HttpStatus.CREATED;
    return res.send('Пользователь создан');
  }

  @Post('/login')
  @UseGuards(LoginGuard)
  async login(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.usersServise.login(createUserDto);

    const access = await this.authService.generateAccessToken(user);
    const refresh = await this.authService.generateRefreshToken(
      user._id as string,
    );

    res.statusCode = HttpStatus.OK;
    return res.send({
      ...access,
      ...refresh,
      username: user.username,
      email: user.email,
    });
  }

  @Post('/refresh')
  @UseGuards(RefreshJwtGuard)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const validToken = this.authService.verifyToken(
      refreshTokenDto.refresh_token,
    );
    const user = await this.usersServise.findOne(refreshTokenDto.username);

    const access = await this.authService.generateAccessToken(user);

    if (validToken?.error) {
      if (validToken?.error === 'jwt expired') {
        const refresh = await this.authService.generateRefreshToken(
          user._id as string,
        );

        res.statusCode = HttpStatus.OK;
        return res.send({ ...access, ...refresh });
      } else {
        res.statusCode = HttpStatus.BAD_REQUEST;
        return res.send({ error: validToken?.error });
      }
    } else {
      res.statusCode = HttpStatus.OK;
      return res.send({
        ...access,
        refresh_token: refreshTokenDto.refresh_token,
      });
    }
  }
}
