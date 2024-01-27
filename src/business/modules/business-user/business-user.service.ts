import { Injectable } from '@nestjs/common';
import { CreateBusinessUserDto } from './dtos/create-business-user.dto';
import { BusinessUserService as DbBusinessUserService } from '@/modules/db/services/business-user.service';
import { BusinessUser } from '@/modules/db/schemas/business-user.schema';
import { UtilityService } from '@/modules/utility/utility.service';
import { UpdateBusinessUserDto } from './dtos/update-business-user.dto';
import { GetBusinessUsersDto } from './dtos/get-business-users.dto';
import { FastifyRequest } from 'fastify';

@Injectable()
export class BusinessUserService {
  constructor(
    private dbBusinessUserService: DbBusinessUserService,
    private utilityService: UtilityService,
  ) {}

  async addNewUser(
    createBusinessUserDto: CreateBusinessUserDto,
    businessId: string,
  ): Promise<BusinessUser> {
    return this.dbBusinessUserService.create({
      name: createBusinessUserDto.name,
      username: createBusinessUserDto.username,
      password: this.utilityService.encrypt(createBusinessUserDto.password),
      business: businessId,
    });
  }

  async getPaginatedList(
    filters: GetBusinessUsersDto,
    req: FastifyRequest,
  ): Promise<{
    data: BusinessUser[];
    total: number;
    prev: string;
    next: string;
    final: boolean;
  }> {
    let data: BusinessUser[];
    let final = false;

    if (filters.next || filters.page == 1) {
      data = await this.dbBusinessUserService.findMany(
        filters,
        filters.limit + 1,
        {
          createdAt: -1,
        },
      );

      final = data.length <= filters.limit;

      // check if exceed limit
      if (data.length > filters.limit) {
        data.pop();
      }
    } else {
      data = await this.dbBusinessUserService.findMany(
        filters,
        filters.limit + 1,
        {
          createdAt: -1,
        },
      );
    }

    return {
      data: data,
      total: filters.page == 1 ? await this.getCount(filters) : 0,
      // create paginate link
      ...this.utilityService.createPaginateLink(data, req, filters, final),
      final: final,
    };
  }

  async getCount(filters: GetBusinessUsersDto): Promise<number> {
    return this.dbBusinessUserService.count(filters);
  }

  async getOne(useId: string): Promise<BusinessUser> {
    return this.dbBusinessUserService.findOne({ _id: useId }, [], {
      _id: 1,
      name: 1,
      username: 1,
    });
  }

  async updateById(
    userId: string,
    updateBusinessUserDto: UpdateBusinessUserDto,
  ): Promise<BusinessUser> {
    return this.dbBusinessUserService.updateById(userId, {
      name: updateBusinessUserDto.name,
      password: this.utilityService.encrypt(updateBusinessUserDto.password),
    });
  }
}
