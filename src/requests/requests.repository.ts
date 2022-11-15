/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';
import Logger from 'config/log4js/logger';
import { EntityRepository, Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './entities/request.entity';

@EntityRepository(Request)
export class RequestsRepository extends Repository<Request> {
  async createRequest(createRequestDto: CreateRequestDto) {
    //
  }

  async getRequests(): Promise<Request[]> {
    const requests = await this.find();
    return requests;
  }

  async getRequestById(id: string): Promise<Request> {
    if (id.length !== 36) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `invalid id: ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const request = await this.findOne(id);
    try {
      if (!request) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'request not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      new Logger().log('error', 'error', error.message, 'RequestsRepository');
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return request;
  }

  async updateRequest(
    id: string,
    updateRequestDto: UpdateRequestDto,
  ): Promise<Request | any> {
    //
  }
}
