import { AUTHENTICATE_METHODS } from '@/end-user/configs/auth-method.config';
import { User } from '@/modules/db/schemas/user.schema';
import { UserService as DbUserService } from '@/modules/db/services/user.service';
import { UtilityService } from '@/modules/utility/utility.service';
import { AuthenticateDto } from '@end-user/modules/auth/dtos/authenticate.dto';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { randomBytes } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private dbUserService: DbUserService,
    private jwtService: JwtService,
    private httpService: HttpService,
    private configService: ConfigService,
    private utilityService: UtilityService,
  ) {}

  async authenticate(authenticateDto: AuthenticateDto): Promise<User> {
    let user: User;

    switch (authenticateDto.authMethod) {
      case AUTHENTICATE_METHODS.PHONE:
        user = await this.phoneAuthenticate(authenticateDto);
        break;
      case AUTHENTICATE_METHODS.GOOGLE:
        user = await this.googleAuthenticate(authenticateDto);
        break;
      case AUTHENTICATE_METHODS.FACEBOOK:
        user = await this.facebookAuthenticate(authenticateDto);
        break;
    }

    return user;
  }

  private async validateGoogleOauth(token: string): Promise<string> {
    const client = new OAuth2Client();

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: [
          this.configService.get<string>('GOOGLE_OAUTH_ANDROID'),
          this.configService.get<string>('GOOGLE_OAUTH_IOS'),
        ],
      });
      const { sub: googleId } = ticket.getPayload();
      return googleId;
    } catch (error) {
      throw new InternalServerErrorException('Invalid google oauth token');
    }
  }

  private async validateFacebookOauth(token: string): Promise<any> {
    const {
      data: { user_id: facebookId },
    } = await firstValueFrom(
      this.httpService
        .get(
          this.configService.get<string>('FACEBOOK_OAUTH_VALIDATE_ENDPOINT'),
          {
            params: {
              input_token: token,
              access_token:
                this.configService.get<string>('FACEBOOK_APP_TOKEN'),
            },
          },
        )
        .pipe(
          catchError((error) => {
            throw new InternalServerErrorException(
              'Invalid facebook oauth token',
            );
          }),
        ),
    );
    //   {
    //     "data": {
    //         "app_id": 138483919580948,
    //         "type": "USER",
    //         "application": "Social Cafe",
    //         "expires_at": 1352419328,
    //         "is_valid": true,
    //         "issued_at": 1347235328,
    //         "metadata": {
    //             "sso": "iphone-safari"
    //         },
    //         "scopes": [
    //             "email",
    //             "publish_actions"
    //         ],
    //         "user_id": "1207059"
    //     }
    // }
    return facebookId;
  }

  private async phoneAuthenticate(
    authenticateDto: AuthenticateDto,
  ): Promise<User> {
    const otp = await this.cacheManager.get(authenticateDto.phone);

    if (otp != authenticateDto.otp) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    let user = await this.dbUserService.findOne({
      phone: authenticateDto.phone,
    });

    if (!user) {
      user = await this.dbUserService.create({
        authMethod: authenticateDto.authMethod,
        phone: authenticateDto.phone,
        jwtSession: randomBytes(16).toString('hex'),
      });
    }

    return user;
  }

  private async googleAuthenticate(
    authenticateDto: AuthenticateDto,
  ): Promise<User> {
    const googleId = await this.validateGoogleOauth(authenticateDto.oauthToken);

    let user = await this.dbUserService.findOne({ googleId: googleId });

    if (!user) {
      user = await this.dbUserService.create({
        authMethod: authenticateDto.authMethod,
        googleId: googleId,
      });
    }

    return user;
  }

  private async facebookAuthenticate(
    authenticateDto: AuthenticateDto,
  ): Promise<any> {
    const facebookId = this.validateFacebookOauth(authenticateDto.oauthToken);

    let user = await this.dbUserService.findOne({ facebookId: facebookId });

    if (!user) {
      user = await this.dbUserService.create({
        authMethod: authenticateDto.authMethod,
        facebookId: facebookId,
      });
    }

    return user;
  }

  async generateAuthToken(id: string, jwtSession: string): Promise<string> {
    return this.jwtService.signAsync(
      this.utilityService.encrypt(
        JSON.stringify({
          id: id,
          jwtSession: jwtSession,
          issueDate: new Date().getTime(),
        }),
      ),
    );
  }

  async logout(userId: string): Promise<User> {
    return this.dbUserService.updateById(userId, {
      jwtSession: '',
    });
  }
}
