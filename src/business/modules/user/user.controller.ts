import { IResponse } from '@/interfaces/response.interface';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { OwnerGuard } from '@/business/guards/owner.guard';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { Business } from '@/modules/db/schemas/business.schema';

@Controller('business/user')
@UseGuards(OwnerGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async list(@Query() query: Record<string, any>): Promise<IResponse> {
    const users = await this.userService.getList(query, query?.lastCreatedAt);

    return {
      message: 'Successfully retrieved',
      data: users,
    };
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @AuthUser() business: Business,
  ): Promise<IResponse> {
    await this.userService.addNewUser(createUserDto, business._id.toString());

    return {
      message: 'Successfully created',
      data: {},
    };
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<IResponse> {
    const user = await this.userService.getOne(id);
    return {
      message: 'Successfully retrieved',
      data: user,
    };
  }
}
