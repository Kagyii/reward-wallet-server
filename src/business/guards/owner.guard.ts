import { BusinessService as DbBusinessService } from '@/modules/db/services/business.service';
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
export class OwnerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private utilityService: UtilityService,
    private dbBusinessService: DbBusinessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.utilityService.extractBearerToken(request);
      if (!token) throw new UnauthorizedException();

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const { id, jwtSession } = JSON.parse(
        this.utilityService.decrypt(payload),
      );

      const business = await this.dbBusinessService.findOne({
        _id: id,
        jwtSession: jwtSession,
      });

      if (!business) throw new UnauthorizedException();

      request['authUser'] = business;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException();
    }
  }
}
