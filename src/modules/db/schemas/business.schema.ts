import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type BusinessDocument = HydratedDocument<Business>;

@Schema({ timestamps: true, versionKey: false })
export class Business {
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    unique: true,
    immutable: true,
  })
  username: string;

  @Prop({ type: SchemaTypes.String, required: true })
  password: string;

  @Prop({ type: SchemaTypes.String, required: true })
  name: string;

  @Prop({ type: SchemaTypes.String, required: true })
  email: string;

  @Prop({ type: SchemaTypes.Array, required: true })
  phone: string[];

  @Prop({ type: SchemaTypes.String, required: true })
  logo: string;

  @Prop({ type: SchemaTypes.String })
  jwtSession: string;

  @Prop({ type: SchemaTypes.Date, select: false })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date, select: false })
  updatedAt: Date;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);

export const BUSINESS_SCHEMA_NAME = 'businesses';
