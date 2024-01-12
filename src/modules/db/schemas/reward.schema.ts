import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BUSINESS_SCHEMA_NAME, Business } from './business.schema';
import { REWARD_TYPE } from '@/config/reward-type.config';

@Schema({ timestamps: true, versionKey: false })
export class Reward {
  _id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: BUSINESS_SCHEMA_NAME,
    immutable: true,
  })
  business: Business;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: Object.values(REWARD_TYPE),
    immutable: true,
  })
  type: string;

  @Prop({ type: SchemaTypes.Number })
  amountPerX: number;

  @Prop({ type: SchemaTypes.Number })
  amountPerStamp: number;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  title: string;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  tc: string;

  @Prop({ type: SchemaTypes.String, trim: true })
  guide: string;

  @Prop({ type: SchemaTypes.Boolean, immutable: true })
  timeLimit: boolean;

  @Prop({ type: SchemaTypes.Date })
  startDate: Date;

  @Prop({ type: SchemaTypes.Date })
  endDate: Date;

  @Prop({ type: SchemaTypes.Date })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date })
  updatedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

export const REWARD_SCHEMA_NAME = 'rewards';
