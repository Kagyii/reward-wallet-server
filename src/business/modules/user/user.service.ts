import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { BusinessUserService } from '@/modules/db/services/business-user.service';
import { BusinessUser } from '@/modules/db/schemas/business-user.schema';
import { UtilityService } from '@/modules/utility/utility.service';

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
}
