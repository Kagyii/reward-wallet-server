import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
// import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UtilityService } from '@/modules/utility/utility.service';
import { UserService } from '@/modules/db/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private utilityService: UtilityService,
    private userService: UserService,
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

      const user = await this.userService.findOne({
        _id: id,
        jwtSession: jwtSession,
      });

      if (!user) throw new UnauthorizedException();

      request['authUser'] = user;

      return true;
    } catch (error) {
      console.log(error);

      if (error instanceof UnauthorizedException) throw error;

      throw new InternalServerErrorException();
    }
  }
}
