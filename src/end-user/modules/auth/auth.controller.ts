import { AuthUser } from '@/decorators/auth-user.decorator';
import { AuthGuard } from '@/end-user/guards/auth.guard';
import { IResponse } from '@/interfaces/response.interface';
import { User } from '@/modules/db/schemas/user.schema';
import { OtpService } from '@/modules/otp/otp.service';
import { AuthService } from '@end-user/modules/auth/auth.service';
import { AuthenticateDto } from '@end-user/modules/auth/dtos/authenticate.dto';
import { RequestOtpDto } from '@end-user/modules/auth/dtos/request-otp.dto';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

@Controller('end-user/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post()
  async authenticate(
    @Body() authenticateDto: AuthenticateDto,
  ): Promise<IResponse> {
    const user = await this.authService.authenticate(authenticateDto);

    const authToken = await this.authService.generateAuthToken(
      user._id.toString(),
      user.jwtSession,
    );

    return {
      message: 'Successfully authenticated',
      data: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        googleId: user.googleId,
        facebookId: user.facebookId,
        authMethod: user.authMethod,
        authToken: authToken,
      },
    };
  }

  @Get('otp')
  async getOTP(@Query() requestOtpDto: RequestOtpDto): Promise<IResponse> {
    await this.otpService.sendOTP(requestOtpDto.phone);
    return {
      message: 'Successfully sent OTP',
      data: {},
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@AuthUser() authUser: User): Promise<IResponse> {
    await this.authService.logout(authUser._id.toString());

    return {
      message: 'Successfully logout',
      data: {},
    };
  }
}
