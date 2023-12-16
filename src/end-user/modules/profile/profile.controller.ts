import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { IResponse } from '@/interfaces/response.interface';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { AuthGuard } from '@/end-user/guards/auth.guard';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { User } from '@/modules/db/schemas/user.schema';

@Controller('end-user/profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async get(@AuthUser() authUser: User): Promise<IResponse> {
    return {
      message: 'Success',
      data: {
        name: authUser.name,
        dateOfBirth: authUser.dob,
        phone: authUser.phone,
      },
    };
  }

  @Put()
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @AuthUser() authUser: User,
  ): Promise<IResponse> {
    const user = await this.profileService.updateProfile(
      authUser._id.toString(),
      updateProfileDto,
    );
    console.log(user);

    return {
      message: 'Successfully updated',
      data: {
        name: user.name,
        dateOfBirth: user.dob,
        phone: user.phone,
      },
    };
  }
}
