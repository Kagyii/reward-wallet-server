import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private readonly otpExpire = 60; //second

  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async sendOTP(phone: string): Promise<void> {
    const d1 = Math.floor(Math.random() * 10).toString();
    const d2 = Math.floor(Math.random() * 10).toString();
    const d3 = Math.floor(Math.random() * 10).toString();
    const d4 = Math.floor(Math.random() * 10).toString();
    const d5 = Math.floor(Math.random() * 10).toString();
    const d6 = Math.floor(Math.random() * 10).toString();

    const otp = `${d1}${d2}${d3}${d4}${d5}${d6}`;

    Logger.warn({ message: otp });

    await this.cacheManager.set(phone, otp, this.otpExpire);

    // await firstValueFrom(
    //   this.httpService
    //     .post('send', {
    //       to: phone,
    //       message: `Your activation code for ${this.configService.get<string>(
    //         'SMSPOH_SENDER',
    //       )} is ${otp}`,
    //       sender: this.configService.get<string>('SMSPOH_SENDER'),
    //       test: true,
    //     })
    //     .pipe(
    //       catchError((error) => {
    //         throw new InternalServerErrorException('Sent OTP Error', {
    //           cause: error,
    //           description: "Something's wrong with the OTP service",
    //         });
    //       }),
    //     ),
    // );
  }
}
