import { IResponse } from '@/interfaces/response.interface';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateBusinessUserDto } from './dtos/create-business-user.dto';
import { BusinessUserService } from './business-user.service';
import { OwnerGuard } from '@/business/guards/owner.guard';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { Business } from '@/modules/db/schemas/business.schema';
import { GetBusinessUsersDto } from './dtos/get-business-users.dto';
import { FastifyRequest } from 'fastify';

@Controller('business/user')
@UseGuards(OwnerGuard)
export class BusinessUserController {
  constructor(private businessUserService: BusinessUserService) {}

  @Get()
  async list(
    @Query() getBusinessUsersDto: GetBusinessUsersDto,
    @Req() req: FastifyRequest,
  ): Promise<IResponse> {
    const paginatedData = await this.businessUserService.getPaginatedList(
      getBusinessUsersDto,
      req,
    );

    return {
      message: 'Successfully retrieved',
      data: paginatedData.data,
      meta: {
        total: paginatedData.total,
        prev: paginatedData.prev,
        next: paginatedData.next,
        final: paginatedData.final,
      },
    };
  }

  @Post()
  async create(
    @Body() createBusinessUserDto: CreateBusinessUserDto,
    @AuthUser() business: Business,
  ): Promise<IResponse> {
    await this.businessUserService.addNewUser(
      createBusinessUserDto,
      business._id.toString(),
    );

    return {
      message: 'Successfully created',
      data: {},
    };
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<IResponse> {
    const businessUser = await this.businessUserService.getOne(id);
    return {
      message: 'Successfully retrieved',
      data: businessUser,
    };
  }
}
