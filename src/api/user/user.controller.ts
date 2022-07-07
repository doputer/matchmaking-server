import {
  ApiDelete,
  ApiGet,
  ApiPatch,
  ApiPost,
} from 'src/common/decorators/api.decorator';

import { Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDocument } from './user.schema';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiGet('', '모든 사용자 조회')
  async findAll(): Promise<UserDocument[]> {
    const users = await this.userService.findAll();

    return users;
  }

  @ApiGet(':id', '특정 사용자 조회')
  async findOne(@Param('id') id: string): Promise<UserDocument> {
    const user = await this.userService.findOne(id);

    return user;
  }

  @ApiPost('', '사용자 생성')
  async createOne(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userService.createOne(createUserDto);

    return user;
  }

  @ApiPatch(':id', '특정 사용자 수정')
  async updateOne(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.userService.updateOne(id, updateUserDto);

    return user;
  }

  @ApiDelete(':id', '특정 사용자 삭제')
  async deleteOne(@Param('id') id: string): Promise<UserDocument> {
    const user = await this.userService.deleteOne(id);

    return user;
  }
}
