import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  university: string;

  @Prop({ default: '' })
  courseOfStudy: string;

  @Prop({ default: 1, min: 1, max: 6 })
  yearOfStudy: number;

  @Prop({ type: [String], default: [] })
  goals: string[];

  @Prop({ default: false })
  isOnboarded: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
