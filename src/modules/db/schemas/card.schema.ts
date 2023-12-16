import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BUSINESS_SCHEMA_NAME, Business } from './business.schema';

@Schema({ timestamps: true, versionKey: false })
export class Card {
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: BUSINESS_SCHEMA_NAME,
  })
  business: Business;

  @Prop({ type: SchemaTypes.String, required: true })
  title: Business;

  @Prop({ type: SchemaTypes.String, required: true })
  tc: string;

  @Prop({ type: SchemaTypes.Date, select: false })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date, select: false })
  updatedAt: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);

export const CARD_SCHEMA_NAME = 'cards';
