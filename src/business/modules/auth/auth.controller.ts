import { IResponse } from '@/interfaces/response.interface';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OwnerAuthDto } from './dtos/owner-auth.dto';
import { UserAuthDto } from './dtos/user-auth.dto';
import { OwnerGuard } from '@/business/guards/owner.guard';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { BusinessUser } from '@/modules/db/schemas/business-user.schema';
import { UserGuard } from '@/business/guards/user.guard';
import { Business } from '@/modules/db/schemas/business.schema';

@Controller('business/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('owner')
  async ownerLogin(@Body() ownerAuthDto: OwnerAuthDto): Promise<IResponse> {
    let business = await this.authService.authenticateOwner(ownerAuthDto);

    business = await this.authService.addJwtSessionToOwner(business);

    const authToken = await this.authService.generateAuthToken(
      business._id.toString(),
      business.jwtSession,
    );
    return {
      message: 'Successfully login',
      data: {
        name: business.name,
        authToken: authToken,
      },
    };
  }

  @Post('owner/logout')
  @UseGuards(OwnerGuard)
  async ownerLogout(@AuthUser() business: Business): Promise<IResponse> {
    await this.authService.ownerLogout(business._id.toString());
    return {
      message: 'Successfully logout',
      data: {},
    };
  }

  @Post('user')
  async userLogin(@Body() userAuthDto: UserAuthDto): Promise<IResponse> {
    const businessUser =
      await this.authService.authenticateBusinessUser(userAuthDto);

    const authToken = await this.authService.generateAuthToken(
      businessUser._id.toString(),
      '',
    );

    await this.authService.addJwtToBusinessUser(businessUser, authToken);

    return {
      message: 'Successfully login',
      data: {
        name: businessUser.name,
        authToken: authToken,
      },
    };
  }

  @Post('user/logout')
  @UseGuards(UserGuard)
  async userLogout(@AuthUser() businessUser: BusinessUser): Promise<IResponse> {
    await this.authService.businessUserLogout(businessUser._id.toString());
    return {
      message: 'Successfully logout',
      data: {},
    };
  }
}
