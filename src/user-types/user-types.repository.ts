import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UserType } from './entities/user-type.entity';
import Logger from 'config/log4js/logger';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';

@EntityRepository(UserType)
export class UserTypesRepository extends Repository<UserType> {
  async createUserType(
    createUserTypeDto: CreateUserTypeDto,
  ): Promise<UserType> {
    const { name, description } = createUserTypeDto;

    const userType = this.create({
      name,
      description,
    });

    try {
      await this.save(userType);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'department already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        new Logger().log(
          'error',
          'UserTypesRepository',
          'createUserType',
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
    return userType;
  }

  async getUserTypes(): Promise<UserType[]> {
    const userTypes = await this.find();
    return userTypes;
  }

  async getUserTypeById(id: string): Promise<UserType> {
    if (id.length !== 36) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `invalid id: ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const userType = await this.findOne(id);
    try {
      if (!userType) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'user type not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      new Logger().log('error', 'error', error.message, 'getUserTypeById');
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return userType;
  }

  async updateUserType(
    id: string,
    updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UserType> {
    const { name, description } = updateUserTypeDto;

    const userType = await this.getUserTypeById(id);
    userType.name = name || userType.name;
    userType.description = description || userType.description;

    try {
      await this.update(id, {
        name: userType.name,
        description: userType.description,
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'user type already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        new Logger().log(
          'error',
          'UserTypesRepository',
          'updateUserType',
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
    return userType;
  }
}
