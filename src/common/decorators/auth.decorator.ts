import { LoginUserDto } from 'src/api/auth/dtos/login-user.dto';

import {
  applyDecorators,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtRefreshGuard } from 'src/api/auth/guards/jwt-refresh.guard';
import { JwtAccessGuard } from 'src/api/auth/guards/jwt-access.guard';

export const ApiPayload = () => {
  return applyDecorators(
    UseGuards(JwtAccessGuard),
    Get(),
    HttpCode(200),
    ApiOperation({ summary: '액세스 토큰 페이로드' }),
    ApiResponse({ status: 200, description: 'Success' }),
  );
};

export const ApiLogin = () => {
  return applyDecorators(
    Post(),
    HttpCode(200),
    ApiOperation({ summary: '로그인' }),
    ApiBody({ type: LoginUserDto }),
    ApiResponse({ status: 200, description: 'Success' }),
    ApiResponse({ status: 401, description: 'Wrong Password' }),
    ApiResponse({ status: 404, description: 'Wrong Email' }),
  );
};

export const ApiToken = () => {
  return applyDecorators(
    UseGuards(JwtRefreshGuard),
    Get('token'),
    HttpCode(200),
    ApiOperation({ summary: '토큰 재발급' }),
    ApiResponse({
      status: 200,
      description: '액세스 토큰 및 리프레시 토큰 재발급 성공',
    }),
    ApiResponse({
      status: 400,
      description:
        '유효하지 않은 리프레시 토큰 혹은 유효하지 않은 리프레시 토큰 서명',
    }),
    ApiResponse({ status: 401, description: '리프레시 토큰 만료' }),
    ApiResponse({ status: 403, description: '권한 없음' }),
  );
};
