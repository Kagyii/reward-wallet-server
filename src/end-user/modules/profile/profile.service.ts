import { Injectable } from '@nestjs/common';

import { UserService as DbUserService } from '@/modules/db/services/user.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { User } from '@/modules/db/schemas/user.schema';

@Injectable()
export class ProfileService {
  constructor(private dbUserService: DbUserService) {}

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.dbUserService.updateById(userId, {
      name: updateProfileDto.name,
      dob: updateProfileDto.dateOfBirth,
      ...(updateProfileDto.phone && {
        phone: updateProfileDto.phone,
      }),
    });
  }
}
