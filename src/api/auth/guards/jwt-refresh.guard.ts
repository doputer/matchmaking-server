import HttpError from 'src/common/exceptions/http.exception';

import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (authorization === undefined)
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        '리프레시 토큰이 존재하지 않습니다.',
      );

    const refresh_token = authorization.replace('Bearer ', '');
    const { new_access_token, new_refresh_token } = await this.validate(
      refresh_token,
    );

    request.access_token = new_access_token;
    request.refresh_token = new_refresh_token;

    return true;
  }

  async validate(refresh_token: string) {
    try {
      const payload = await this.authService.tokenValidate(refresh_token);
      const db_refresh_token = await this.authService.getRefreshToken(
        payload.id,
      );

      if (refresh_token === db_refresh_token) {
        const user = await this.authService.validateUser(payload.email);

        const new_access_token = await this.authService.createAccessToken(user);
        const new_refresh_token = await this.authService.createRefreshToken(
          user,
        );

        return { new_access_token, new_refresh_token };
      }

      throw new Error('no permission');
    } catch (error) {
      switch (error.message) {
        case 'invalid token':
          throw new HttpError(
            HttpStatus.BAD_REQUEST,
            '유효하지 않은 리프레시 토큰입니다.',
          );
        case 'invalid signature':
          throw new HttpError(
            HttpStatus.BAD_REQUEST,
            '유효하지 않은 리프레시 토큰의 서명입니다.',
          );
        case 'jwt expired':
          throw new HttpError(
            HttpStatus.UNAUTHORIZED,
            '리프레시 토큰이 만료되었습니다.',
          );
        case 'no permission':
          throw new HttpError(HttpStatus.FORBIDDEN, '권한이 없습니다.');
        default:
          throw new HttpError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            '서버 오류 입니다.',
          );
      }
    }
  }
}
