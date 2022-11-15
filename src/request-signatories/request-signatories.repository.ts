import { HttpException, HttpStatus } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import Logger from '../../config/log4js/logger';
import { UsersRepository } from '../auth/users.repository';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { CreateRequestSignatoryDto } from './dto/create-request-signatory.dto';
import { UpdateRequestSignatoryDto } from './dto/update-request-signatory.dto';
import { RequestSignatory } from './entities/request-signatory.entity';

@EntityRepository(RequestSignatory)
export class RequestSignatoriesRepository extends Repository<RequestSignatory> {
  private usersRepository: UsersRepository;
  constructor(private connection: Connection) {
    super();
    this.usersRepository = this.connection.getCustomRepository(UsersRepository);
  }
  async createRequestSignatory(
    createRequestSignatoryDto: CreateRequestSignatoryDto,
  ) {
    const { userId } = createRequestSignatoryDto;
    if (userId.length !== 36) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `invalid user id: ${userId}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const requestSignatory = this.create({
      userId,
    });

    try {
      await this.save(requestSignatory);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'request signatory already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        new Logger().log(
          'error',
          'RequestSignatoriesRepository',
          'createRequestSignatory',
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
    return requestSignatory;
  }

  async getRequestSignatories(): Promise<RequestSignatory[]> {
    const requestSignatoriesRepo = await this.connection
      .getRepository(RequestSignatory)
      .createQueryBuilder('requestSignatory')
      .innerJoinAndSelect('requestSignatory.userId', 'user')
      .getMany();

    requestSignatoriesRepo.forEach((requestSignatory) => {
      delete requestSignatory.userId['password'];
    });

    return requestSignatoriesRepo;
  }

  async getRequestSignatoryById(id: string): Promise<RequestSignatory> {
    if (id.length !== 36) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'invalid id',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const requestSignatory = await this.findOne(id);
    try {
      if (!requestSignatory) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'request signatory not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      new Logger().log(
        'error',
        'RequestSignatoriesRepository',
        'getRequestSignatoryById',
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
    return requestSignatory;
  }

  async updateRequestSignatory(
    id: string,
    updateRequestSignatoryDto: UpdateRequestSignatoryDto,
  ) {
    const { userId } = updateRequestSignatoryDto;
    const user = this.usersRepository.findOne(userId);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const requestSignatory = await this.getRequestSignatoryById(id);
    try {
      if (!requestSignatory) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'request signatory not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      requestSignatory.userId = userId;
      requestSignatory.updatedAt = new Date();
      await this.save(requestSignatory);
    } catch (error) {
      new Logger().log(
        'error',
        'error',
        error.message,
        'updateRequestSignatory',
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return requestSignatory;
  }
}
