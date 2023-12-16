import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BUSINESS_SCHEMA_NAME, Business } from './business.schema';

@Schema({ timestamps: true, versionKey: false })
export class BusinessUser {
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  name: string;

  @Prop({ type: SchemaTypes.String, required: true })
  username: string;

  @Prop({ type: SchemaTypes.String, required: true })
  password: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: BUSINESS_SCHEMA_NAME,
  })
  business: Business;

  @Prop({ type: SchemaTypes.String, default: '' })
  jwt: string;

  @Prop({ type: SchemaTypes.ObjectId })
  role: Types.ObjectId;

  @Prop({ type: SchemaTypes.Date, select: false })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date, select: false })
  updatedAt: Date;
}

export const BusinessUserSchema = SchemaFactory.createForClass(BusinessUser);

export const BUSINESS_USER_SCHEMA_NAME = 'business_users';
