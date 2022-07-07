import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { HttpMessage } from 'src/common/errors/http-message.enum';
import HttpError from 'src/common/exceptions/http.exception';
import { ConfigService } from 'src/config/config.service';

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from '../user/user.schema';
import { Auth, AuthDocument } from './auth.schema';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = loginUserDto;

    const user = await this.validateUser(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new HttpError(HttpStatus.UNAUTHORIZED, HttpMessage.WRONG_PASSWORD);

    const access_token = await this.createAccessToken(user);
    const refresh_token = await this.createRefreshToken(user);

    return {
      access_token,
      refresh_token,
    };
  }

  async validateUser(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne(
      { email },
      { email: true, password: true, role: true },
    );

    if (!user)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_USER);

    return user;
  }

  async createAccessToken(user: UserDocument): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'access_token',
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30m',
    });

    return token;
  }

  async createRefreshToken(user: UserDocument): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh_token',
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('SECRET_KEY'),
      expiresIn: '90d',
    });

    let auth = new Auth();
    auth = {
      ...auth,
      refresh_token: token,
    };

    await this.authModel.findOneAndUpdate({ user_id: user.id }, auth, {
      upsert: true,
    });

    return token;
  }

  async tokenValidate(token: string) {
    return await this.jwtService.verify(token, {
      secret: this.configService.get('SECRET_KEY'),
    });
  }

  async getRefreshToken(id: string): Promise<any> {
    const token = await this.authModel.findOne({ user_id: id });

    if (token) return token.refresh_token;

    return false;
  }
}
