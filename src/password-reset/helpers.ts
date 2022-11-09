import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import getBaseUrl from 'get-base-url';
export class Helper {
  async getBaseUrl() {
    const url = getBaseUrl();
    return await url;
  }

  async getPasswordByEmail(email: string, repository: any): Promise<any> {
    if (email === undefined || email === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'email is required',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const passwordResetRequest = await repository.findOne({
      email,
    });
    return passwordResetRequest;
  }

  async getRequestByUserId(userId: string, repository: any): Promise<any> {
    if (userId === undefined || userId === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user id is required',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const result = await repository.findOne({
      userId,
    });
    return result;
  }

  async findWithToken(token: string, repository: any): Promise<any> {
    if (token === undefined || token === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'token is required',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const tokenFound = await repository.findOne({ token });
    return tokenFound;
  }

  async findUserByEmail(email: string, repository: any): Promise<any> {
    if (email === undefined || email === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'email is required',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const user = await repository.findOne({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
