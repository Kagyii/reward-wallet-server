import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BUSINESS_SCHEMA_NAME, Business } from './business.schema';
import { USER_SCHEMA_NAME, User } from './user.schema';
import { CARD_SCHEMA_NAME, Card } from './card.schema';
import { REWARD_SCHEMA_NAME, Reward } from './reward.schema';

@Schema({ timestamps: true, versionKey: false })
export class BusinessCustomer {
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: BUSINESS_SCHEMA_NAME,
    immutable: true,
  })
  business: Business;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: USER_SCHEMA_NAME })
  user: User;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: REWARD_SCHEMA_NAME }],
    default: [],
  })
  rewards: Reward[];

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: CARD_SCHEMA_NAME }],
    default: [],
  })
  cards: Card[];

  @Prop({ type: SchemaTypes.Date, select: false })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date, select: false })
  updatedAt: Date;
}

export const BusinessCustomerSchema =
  SchemaFactory.createForClass(BusinessCustomer);

export const BUSINESS_CUSTOMER_SCHEMA_NAME = 'business_customers';
