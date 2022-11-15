import { HttpException, HttpStatus } from '@nestjs/common';
import Logger from 'config/log4js/logger';
import { EntityRepository, Repository } from 'typeorm';
import { CreateRequestTypeDto } from './dto/create-request-type.dto';
import { UpdateRequestTypeDto } from './dto/update-request-type.dto';
import { RequestType } from './entities/request-type.entity';

@EntityRepository(RequestType)
export class RequestTypesRepository extends Repository<RequestType> {
  async createRequestType(createRequestTypeDto: CreateRequestTypeDto) {
    const { name, description } = createRequestTypeDto;
    const requestType = this.create({
      name,
      description,
    });

    try {
      await this.save(requestType);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'request type already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        new Logger().log(
          'error',
          'RequestTypesRepository',
          'createRequestType',
          error.message,
        );
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'something went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return requestType;
  }

  async getRequestTypes(): Promise<RequestType[]> {
    const requestTypes = await this.find();
    return requestTypes;
  }

  async getRequestTypeById(id: string): Promise<RequestType> {
    if (id.length !== 36) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `invalid id: ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const requestType = await this.findOne(id);
    try {
      if (!requestType) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'request type not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      new Logger().log(
        'error',
        'error',
        error.message,
        'RequestTypesRepository',
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return requestType;
  }

  async updateRequestType(
    id: string,
    updateRequestTypeDto: UpdateRequestTypeDto,
  ): Promise<RequestType> {
    const { name, description } = updateRequestTypeDto;
    const requestType = await this.getRequestTypeById(id);
    requestType.name = name || requestType.name;
    requestType.description = description || requestType.description;
    requestType.updatedAt = new Date();
    try {
      await this.update(id, {
        name: requestType.name,
        description: requestType.description,
        updatedAt: requestType.updatedAt,
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'request type already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        new Logger().log('error', 'error', 'updateRequestType', error.message);
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'something went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return requestType;
  }
}
