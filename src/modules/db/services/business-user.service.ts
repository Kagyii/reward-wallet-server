import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
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

  async findMany(
    filters: Record<string, any> = {},
    limit: number = 10,
    sort: Record<string, SortOrder> = { createdAt: -1 },
    populates: Array<Record<string, any> & { path: string }> = [],
    select: Record<string, any> = {},
  ): Promise<BusinessUser[]> {
    return this.businessUserModel
      .find(this.getFilters(filters))
      .limit(limit)
      .sort(sort)
      .lean();
  }

  async updateById(
    id: string,
    data: Record<string, any>,
  ): Promise<BusinessUser> {
    return this.businessUserModel.findByIdAndUpdate(id, data).exec();
  }

  private getFilters(filters: Record<string, any>): Record<string, any> {
    const queryFilter = {};

    // pagination
    if (filters.page && filters.page != 1) {
      if (filters.prev) {
        queryFilter['createdAt'] = { $gt: filters.prev };
      }

      if (filters.next) {
        queryFilter['createdAt'] = { $lt: filters.next };
      }
    }

    if (filters.name) {
      queryFilter['name'] = { $regex: filters.name, $options: 'i' };
    }

    return queryFilter;
  }

  async count(filters: Record<string, any> = {}): Promise<number> {
    return this.businessUserModel
      .countDocuments(this.getFilters(filters))
      .lean();
  }
}
