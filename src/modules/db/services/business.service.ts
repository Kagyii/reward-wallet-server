import {
  BUSINESS_SCHEMA_NAME,
  Business,
} from '@/modules/db/schemas/business.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(BUSINESS_SCHEMA_NAME)
    private businessModel: Model<Business>,
  ) {}

  async create(business: Record<string, any>): Promise<Business> {
    return new this.businessModel(business).save();
  }

  async findOne(
    filter: Record<string, any>,
    populates: Array<Record<string, any> & { path: string }> = [],
    select: Record<string, any> = {},
  ): Promise<Business> {
    const query = this.businessModel.findOne(filter);

    populates.forEach((populate) => {
      query.populate(populate);
    });

    query.select(select).lean();

    return query;
  }

  async updateById(id: string, data: Record<string, any>): Promise<Business> {
    return this.businessModel.findByIdAndUpdate(id, data).exec();
  }
}
