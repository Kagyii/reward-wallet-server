import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BUSINESS_CUSTOMER_SCHEMA_NAME,
  BusinessCustomer,
} from '../schemas/business-customer.schema';

@Injectable()
export class BusinessCustomerService {
  constructor(
    @InjectModel(BUSINESS_CUSTOMER_SCHEMA_NAME)
    private businessCustomerModel: Model<BusinessCustomer>,
  ) {}

  async findOne(
    filter: Record<string, any>,
    populates: Array<Record<string, any> & { path: string }> = [],
    select: Record<string, any> = {},
  ): Promise<BusinessCustomer> {
    const query = this.businessCustomerModel.findOne(filter);

    populates.forEach((populate) => {
      query.populate(populate);
    });

    query.select(select).lean();

    return query;
  }

  async updateById(
    id: string,
    data: Record<string, any>,
  ): Promise<BusinessCustomer> {
    return this.businessCustomerModel.findByIdAndUpdate(id, data).exec();
  }

  async getOrCreate(
    businessId: string,
    userId: string,
  ): Promise<BusinessCustomer> {
    let businessCustomer = await this.businessCustomerModel
      .findOne({
        business: businessId,
        user: userId,
      })
      .exec();

    if (!businessCustomer) {
      businessCustomer = await new this.businessCustomerModel({
        business: businessId,
        user: userId,
      }).save();
    }

    return businessCustomer;
  }
}
