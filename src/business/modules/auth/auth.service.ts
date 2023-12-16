import { Business } from '@/modules/db/schemas/business.schema';
import { BusinessService as DbBusinessService } from '@/modules/db/services/business.service';
import { BusinessUserService as DbBusinessUserService } from '@/modules/db/services/business-user.service';
import { UtilityService } from '@/modules/utility/utility.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { OwnerAuthDto } from './dtos/owner-auth.dto';
import { UserAuthDto } from './dtos/user-auth.dto';
import { BusinessUser } from '@/modules/db/schemas/business-user.schema';

@Injectable()
export class AuthService {
  constructor(
    private dbBusinessService: DbBusinessService,
    private dbBusinessUserService: DbBusinessUserService,
    private jwtService: JwtService,
    private utilityService: UtilityService,
  ) {}

  async authenticateOwner(ownerAuthDto: OwnerAuthDto): Promise<Business> {
    const business = await this.dbBusinessService.findOne({
      username: ownerAuthDto.username,
    });

    if (!business) {
      throw new UnauthorizedException('Invalid username');
    }

    if (!(await bcrypt.compare(ownerAuthDto.password, business.password))) {
      throw new UnauthorizedException('Incorrect password');
    }

    return business;
  }

  async authenticateBusinessUser(
    userAuthDto: UserAuthDto,
  ): Promise<BusinessUser> {
    const business = await this.dbBusinessService.findOne({
      username: userAuthDto.businessUsername,
    });

    if (!business) {
      throw new UnauthorizedException('Invalid business username');
    }

    const businessUser = await this.dbBusinessUserService.findOne({
      username: userAuthDto.username,
      business: business._id,
    });

    if (!businessUser) {
      throw new UnauthorizedException('Invalid username');
    }

    if (
      userAuthDto.password != this.utilityService.decrypt(businessUser.password)
    ) {
      throw new UnauthorizedException('Incorrect password');
    }

    return businessUser;
  }

  async addJwtSessionToOwner(business: Business): Promise<Business> {
    let updatedBusiness = business;
    if (!business.jwtSession) {
      updatedBusiness = await this.dbBusinessService.updateById(
        business._id.toString(),
        {
          jwtSession: randomBytes(16).toString('hex'),
        },
      );
    }

    return updatedBusiness;
  }

  async addJwtToBusinessUser(
    businessUser: BusinessUser,
    jwt: string,
  ): Promise<void> {
    await this.dbBusinessUserService.updateById(businessUser._id.toString(), {
      jwt: jwt,
    });
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

  async ownerLogout(businessId: string): Promise<Business> {
    return this.dbBusinessService.updateById(businessId, {
      jwtSession: '',
    });
  }

  async businessUserLogout(businessUserId: string): Promise<BusinessUser> {
    return this.dbBusinessUserService.updateById(businessUserId, {
      jwt: '',
    });
  }
}
