import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateGameDto {
  @IsString()
  winner: Types.ObjectId;

  @IsString()
  loser: Types.ObjectId;
}
