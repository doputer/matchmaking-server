import { Document, SchemaTypes, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Game {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'user' })
  player1: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'user' })
  player2: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'user' })
  winner: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'user' })
  loser: Types.ObjectId;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export type GameDocument = Game & Document;

export const GameSchema = SchemaFactory.createForClass(Game);
