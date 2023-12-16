import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import {
  BUSINESS_CUSTOMER_SCHEMA_NAME,
  BusinessCustomer,
} from './business-customer.schema';
import { REWARD_SCHEMA_NAME, Reward } from './reward.schema';

@Schema({ timestamps: true, versionKey: false })
export class CustomerReward {
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: BUSINESS_CUSTOMER_SCHEMA_NAME,
    immutable: true,
  })
  businessCustomer: BusinessCustomer;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: REWARD_SCHEMA_NAME,
    immutable: true,
  })
  reward: Reward;

  @Prop({ type: SchemaTypes.Number, required: true })
  xCount: number;

  @Prop({ type: SchemaTypes.Date, select: false })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date, select: false })
  updatedAt: Date;
}

export const CustomerRewardSchema =
  SchemaFactory.createForClass(CustomerReward);

export const CUSTOMER_REWARD_SCHEMA_NAME = 'customer_rewards';
