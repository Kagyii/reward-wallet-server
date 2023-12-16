import { IResponse } from '@/interfaces/response.interface';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { OwnerGuard } from '@/business/guards/owner.guard';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { Business } from '@/modules/db/schemas/business.schema';

@Controller('business/user')
@UseGuards(OwnerGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @AuthUser() business: Business,
  ): Promise<IResponse> {
    this.userService.addNewUser(createUserDto, business._id.toString());

    return {
      message: 'Successfully created',
      data: {},
    };
  }
}
