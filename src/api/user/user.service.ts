import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { HttpMessage } from 'src/common/errors/http-message.enum';
import HttpError from 'src/common/exceptions/http.exception';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDocument[]> {
    const users = await this.userModel.find();

    return users;
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    return user;
  }

  async createOne(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, password } = createUserDto;

    const isExist = await this.userModel.findOne({ email });

    if (isExist)
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.DUPLICATE_EMAIL);

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    let user = new User();
    user = {
      ...user,
      ...createUserDto,
      password: hash,
    };

    const createdUser = await this.userModel.create(user);

    return createdUser;
  }

  async updateOne(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const { password } = updateUserDto;

    const saltOrRounds = 10;
    let hash;

    if (password) hash = await bcrypt.hash(password, saltOrRounds);

    let user = new User();
    user = {
      ...user,
      ...updateUserDto,
      password: hash ? hash : undefined,
    };

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      user,
      { new: true },
    );

    return updatedUser;
  }

  async deleteOne(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findOneAndRemove({ _id: id });

    return deletedUser;
  }
}
