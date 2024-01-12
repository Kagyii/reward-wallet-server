import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { BusinessUserService } from '@/modules/db/services/business-user.service';
import { BusinessUser } from '@/modules/db/schemas/business-user.schema';
import { UtilityService } from '@/modules/utility/utility.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private businessUserService: BusinessUserService,
    private utilityService: UtilityService,
  ) {}

  async addNewUser(
    createUserDto: CreateUserDto,
    businessId: string,
  ): Promise<BusinessUser> {
    return this.businessUserService.create({
      name: createUserDto.name,
      username: createUserDto.username,
      password: this.utilityService.encrypt(createUserDto.password),
      business: businessId,
    });
  }

  async getList(
    query: Record<string, any>,
    lastCreatedAt: Date,
  ): Promise<BusinessUser[]> {
    return this.businessUserService.findMany(query, lastCreatedAt);
  }

  async getOne(useId: string): Promise<BusinessUser> {
    return this.businessUserService.findOne({ _id: useId }, [], {
      _id: 1,
      name: 1,
      username: 1,
    });
  }

  async updateById(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<BusinessUser> {
    return this.businessUserService.updateById(userId, {
      name: updateUserDto.name,
      password: this.utilityService.encrypt(updateUserDto.password),
    });
  }
}
