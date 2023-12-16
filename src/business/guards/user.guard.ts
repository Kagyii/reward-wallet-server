import { BusinessUserService as DbBusinessUserService } from '@/modules/db/services/business-user.service';
import { UtilityService } from '@/modules/utility/utility.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private utilityService: UtilityService,
    private dbBusinessUserService: DbBusinessUserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.utilityService.extractBearerToken(request);
      if (!token) throw new UnauthorizedException();

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const { id } = JSON.parse(this.utilityService.decrypt(payload));

      const businessUser = await this.dbBusinessUserService.findOne({
        _id: id,
        jwt: token,
      });

      if (!businessUser) throw new UnauthorizedException();

      request['authUser'] = businessUser;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException();
    }
  }
}
