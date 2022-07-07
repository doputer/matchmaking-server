import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class User {
  @Prop()
  nickname: string;

  @Prop()
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ default: 0 })
  mmr: number;

  @Prop({ default: 0 })
  role: number;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;

  @Prop()
  deleted_at: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
