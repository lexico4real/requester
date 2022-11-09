import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection, EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { DepartmentsRepository } from '../departments/departments.repository';
import { DesignationsRepository } from '../designations/designations.repository';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private departmentsRepository: DepartmentsRepository;
  private designationsRepository: DesignationsRepository;
  constructor(private connection: Connection) {
    super();
    this.departmentsRepository = this.connection.getCustomRepository(
      DepartmentsRepository,
    );
    this.designationsRepository = this.connection.getCustomRepository(
      DesignationsRepository,
    );
  }
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {
      email,
      password,
      firstName,
      lastName,
      otherName,
      departmentId,
      designationId,
    } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const department = await this.departmentsRepository.findOne(departmentId);
    const designation = await this.designationsRepository.findOne(
      designationId,
    );

    if (!department) {
      throw new ConflictException('department does not exist');
    }

    if (!designation) {
      throw new ConflictException('designation does not exist');
    }

    const user = this.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      otherName,
      departmentId: department.id,
      designationId: designation.id,
    });

    try {
      await this.save(user);
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
