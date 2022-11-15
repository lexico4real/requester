/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { PasswordReset } from './entities/password-reset.entity';

@EntityRepository(PasswordReset)
export class PasswordResetRepository extends Repository<PasswordReset> {
  async findUserByEmail(email: string): Promise<any> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getPasswordReset(email: string, token: string): Promise<PasswordReset> {
    const passwordReset = await this.findOne({ email, token });
    if (!passwordReset) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'password reset not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return passwordReset;
  }
}
