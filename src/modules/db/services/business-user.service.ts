import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BUSINESS_USER_SCHEMA_NAME,
  BusinessUser,
} from '../schemas/business-user.schema';

@Injectable()
export class BusinessUserService {
  constructor(
    @InjectModel(BUSINESS_USER_SCHEMA_NAME)
    private businessUserModel: Model<BusinessUser>,
  ) {}

  async create(businessUser: Record<string, any>): Promise<BusinessUser> {
    return new this.businessUserModel(businessUser).save();
  }

  async findOne(
    filter: Record<string, any>,
    populates: Array<Record<string, any> & { path: string }> = [],
    select: Record<string, any> = {},
  ): Promise<BusinessUser> {
    const query = this.businessUserModel.findOne(filter);

    populates.forEach((populate) => {
      query.populate(populate);
    });

    query.select(select).lean();

    return query;
  }

  async updateById(
    id: string,
    data: Record<string, any>,
  ): Promise<BusinessUser> {
    return this.businessUserModel.findByIdAndUpdate(id, data).exec();
  }
}
