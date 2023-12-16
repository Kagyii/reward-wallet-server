import { AUTHENTICATE_METHODS } from '@/end-user/configs/auth-method.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.String, trim: true })
  name: string;

  @Prop({ type: SchemaTypes.Date })
  dob: Date;

  @Prop({ type: SchemaTypes.String })
  phone: string;

  @Prop({ type: SchemaTypes.String, immutable: true })
  googleId: string;

  @Prop({ type: SchemaTypes.String, immutable: true })
  facebookId: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    immutable: true,
    enum: Object.values(AUTHENTICATE_METHODS),
  })
  authMethod: string;

  @Prop({ type: SchemaTypes.String })
  jwtSession: string;

  @Prop({ type: SchemaTypes.Date, select: false })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date, select: false })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const USER_SCHEMA_NAME = 'users';
