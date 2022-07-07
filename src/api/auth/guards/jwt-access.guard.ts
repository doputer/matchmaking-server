import HttpError from 'src/common/exceptions/http.exception';

import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (authorization === undefined)
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        '액세스 토큰이 존재하지 않습니다.',
      );

    const access_token = authorization.replace('Bearer ', '');
    const payload = await this.validate(access_token);

    request.user = payload;

    return true;
  }

  async validate(token: string) {
    try {
      const payload = await this.authService.tokenValidate(token);

      return payload;
    } catch (error) {
      switch (error.message) {
        case 'invalid token':
          throw new HttpError(
            HttpStatus.BAD_REQUEST,
            '유효하지 않은 액세스 토큰입니다.',
          );
        case 'invalid signature':
          throw new HttpError(
            HttpStatus.BAD_REQUEST,
            '유효하지 않은 액세스 토큰의 서명입니다.',
          );
        case 'jwt expired':
          throw new HttpError(
            HttpStatus.UNAUTHORIZED,
            '액세스 토큰이 만료되었습니다.',
          );
        default:
          throw new HttpError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            '서버 오류 입니다.',
          );
      }
    }
  }
}
