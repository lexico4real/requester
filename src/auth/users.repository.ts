import {
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { DepartmentsRepository } from '../departments/departments.repository';
import { DesignationsRepository } from '../designations/designations.repository';
import { UserTypesRepository } from '../user-types/user-types.repository';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private departmentsRepository: DepartmentsRepository;
  private designationsRepository: DesignationsRepository;
  private userTypesRepository: UserTypesRepository;
  constructor(private connection: Connection) {
    super();
    this.departmentsRepository = this.connection.getCustomRepository(
      DepartmentsRepository,
    );
    this.designationsRepository = this.connection.getCustomRepository(
      DesignationsRepository,
    );
    this.userTypesRepository =
      this.connection.getCustomRepository(UserTypesRepository);
  }
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const {
      email,
      password,
      firstName,
      lastName,
      otherName,
      gender,
      userTypeId,
      departmentId,
      designationId,
    } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const department = await this.departmentsRepository.findOne(departmentId);
    const designation = await this.designationsRepository.findOne(
      designationId,
    );
    const userType = await this.userTypesRepository.findOne(userTypeId);

    if (!department) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'department not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!designation) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'designation not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!userType) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'user type not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const user = this.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      otherName,
      gender: gender as unknown as any,
      userTypeId,
      departmentId: department.id,
      designationId: designation.id,
    });

    try {
      await this.save(user);
      return {
        status: HttpStatus.CREATED,
        message: 'user created successfully',
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        throw new InternalServerErrorException(
          `something went wrong: ${error.message}`,
        );
      }
    }
  }
}
