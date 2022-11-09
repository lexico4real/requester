/* eslint-disable prettier/prettier */
import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { PasswordReset } from './entities/password-reset.entity';

@EntityRepository(PasswordReset)
export class PasswordResetRepository extends Repository<PasswordReset> {
  // async createPasswordReset(
  //   email: string,
  //   token: string,
  // ): Promise<PasswordReset> {
  //   const passwordReset = new PasswordReset();
  //   passwordReset.email = email;
  //   passwordReset.token = token;
  //   passwordReset.isVerified = false;
  //   passwordReset.isExpired = false;
  //   await passwordReset.save();
  //   return passwordReset;
  // }

  // async updatePasswordReset(
  //   email: string,
  //   token: string,
  //   isVerified: boolean,
  //   isExpired: boolean,
  // ): Promise<PasswordReset> {
  //   const passwordReset = await this.findOne({ email, token });
  //   passwordReset.isVerified = isVerified;
  //   passwordReset.isExpired = isExpired;
  //   await passwordReset.save();
  //   return passwordReset;
  // }

  async findUserByEmail(email: string): Promise<any> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async getPasswordReset(email: string, token: string): Promise<PasswordReset> {
    const passwordReset = await this.findOne({ email, token });
    return passwordReset;
  }
}
