import { HttpException, HttpStatus } from '@nestjs/common';
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
    const query = this.createQueryBuilder('designation');
    query.where('designation.id = :id', { id });
    const designation = await query.getOne();
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
      await this.update(id, {
        name: designation.name,
        description: designation.description,
      });
    } catch (error) {
      return error;
    }
    return designation;
  }

  async deleteDesignation(id: string): Promise<void> {
    await this.delete(id);
  }
}
