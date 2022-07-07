import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGameDto {
  @IsString()
  player1: Types.ObjectId;

  @IsString()
  player2: Types.ObjectId;
}
