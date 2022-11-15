import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import Mailer from '../../config/mail/mailer';
import { UsersRepository } from '../auth/users.repository';
import * as bcrypt from 'bcrypt';
import { Helper } from './helpers';

const helper = new Helper();

@Injectable()
export class PasswordResetService {
  private usersRepository: UsersRepository;
  constructor(
    @InjectRepository(PasswordReset)
    private readonly passwordRepository: Repository<PasswordReset>,
    private readonly mailer: Mailer,
    private readonly connection: Connection,
  ) {
    this.usersRepository = this.connection.getCustomRepository(UsersRepository);
  }

  async sendMessage(
    email: string,
    name: string,
    subject: string,
    description: string,
  ): Promise<any> {
    try {
      await this.mailer.main(email, name, subject, description);
      return {
        status: 'success',
        code: HttpStatus.OK,
        message: 'email sent',
        time: new Date(),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'email not sent',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createRequest(email: string, token: string): Promise<any> {
    const getUser = await helper.findUserByEmail(email, this.usersRepository);

    if (getUser) {
      const getDetailByUserId = await helper.getRequestByUserId(
        getUser.id,
        this.passwordRepository,
      );
      if (getDetailByUserId) {
        await this.passwordRepository.update(getDetailByUserId.id, {
          isVerified: false,
          isExpired: true,
        });
      }
      let resetRequest: any;
      try {
        resetRequest = await this.passwordRepository.save({
          userId: getUser.id,
          email,
          token,
          isVerified: false,
          isExpired: false,
        });
        let baseUrl: any = helper.getBaseUrl;
        baseUrl = await baseUrl();

        const resetUrl = `http://${baseUrl}:${process.env.API_PORT}/api/v1/auth/update-password?email=${email}&token=${token}`;

        await this.sendMessage(
          email,
          'MTN Requester',
          'New Password Link',
          `Your reset link is ${resetUrl}`,
        );
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'error sending email',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        status: 'success',
        code: HttpStatus.CREATED,
        message: 'password reset link sent',
        time: new Date(),
        data: resetRequest,
      };
    }
  }

  async updatePassword(token: string, email: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const tokenFound = await helper.findWithToken(
      token,
      this.passwordRepository,
    );
    const emailFound = await helper.findUserByEmail(
      email,
      this.usersRepository,
    );

    if (!tokenFound || !emailFound || tokenFound.isExpired) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'this link is invalid',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.passwordRepository.update(tokenFound.id, {
      isVerified: true,
      isExpired: true,
    });
    await this.usersRepository.update(emailFound.id, {
      password: hashedPassword,
      isVerified: true,
    });
    return {
      status: 'success',
      code: HttpStatus.OK,
      message: 'password reset successful',
      time: new Date(),
    };
  }
}
