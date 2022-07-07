import {
  ApiLogin,
  ApiPayload,
  ApiToken,
} from 'src/common/decorators/auth.decorator';

import { Body, Controller, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiPayload()
  async payload(@Req() req: any) {
    const user = req.user;

    return user;
  }

  @ApiLogin()
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { access_token, refresh_token } = await this.authService.login(
      loginUserDto,
    );

    return { access_token, refresh_token };
  }

  @ApiToken()
  async token(@Req() req: any) {
    const access_token = req.access_token;
    const refresh_token = req.refresh_token;

    return { access_token, refresh_token };
  }
}
