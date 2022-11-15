import { HttpException, HttpStatus } from '@nestjs/common';
import Logger from 'config/log4js/logger';
import { EntityRepository, Repository } from 'typeorm';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Designation } from './entities/designation.entity';

@EntityRepository(Designation)
export class DesignationsRepository extends Repository<Designation> {
  async createDesignation(
    createDesignationDto: CreateDesignationDto,
  ): Promise<Designation> {
    const { name, description } = createDesignationDto;
    const designation = this.create({
      name,
      description,
    });
    try {
      await this.save(designation);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'designation already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        new Logger().log(
          'error',
          'error',
          error.message,
          'DesignationsRepository',
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
    return designation;
  }

  async getDesignations(): Promise<Designation[]> {
    const query = this.createQueryBuilder('designation');
    const designations = await query.getMany();
    return designations;
  }

  async getDesignationById(id: string): Promise<Designation> {
    if (id.length !== 36) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `invalid id: ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let designation: any;
    try {
      const query = this.createQueryBuilder('designation');
      query.where('designation.id = :id', { id });
      designation = await query.getOne();
      if (!designation) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `designation not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      new Logger().log(
        'error',
        'error',
        error.message,
        'DesignationsRepository',
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return designation;
  }

  async updateDesignation(
    id: string,
    updateDesignationDto: UpdateDesignationDto,
  ): Promise<Designation> {
    const { name, description } = updateDesignationDto;
    const designation = await this.getDesignationById(id);
    try {
      designation.name = name || designation.name;
      designation.description = description || designation.description;
      designation.updatedAt = new Date();
      await this.update(id, {
        name: designation.name,
        description: designation.description,
        updatedAt: designation.updatedAt,
      });
    } catch (error) {
      new Logger().log(
        'error',
        'error',
        error.message,
        'DesignationsRepository',
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return designation;
  }
}
