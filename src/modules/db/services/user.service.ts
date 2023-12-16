import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, USER_SCHEMA_NAME } from '@/modules/db/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER_SCHEMA_NAME) private userModel: Model<User>) {}

  async create(user: Record<string, any>): Promise<User> {
    return new this.userModel(user).save();
  }

  async findOne(
    filter: Record<string, any>,
    populates: Array<Record<string, any> & { path: string }> = [],
    select: Record<string, any> = {},
  ): Promise<User> {
    const query = this.userModel.findOne(filter);

    populates.forEach((populate) => {
      query.populate(populate);
    });

    query.select(select).lean();

    return query;
  }

  async updateById(id: string, data: Record<string, any>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data).exec();
  }
}
