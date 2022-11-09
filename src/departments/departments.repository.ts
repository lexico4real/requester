import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@EntityRepository(Department)
export class DepartmentsRepository extends Repository<Department> {
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const { name, description } = createDepartmentDto;
    const department = this.create({
      name,
      description,
    });
    try {
      await this.save(department);
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
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'something went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return department;
  }

  async getDepartments(): Promise<Department[]> {
    const query = this.createQueryBuilder('department');
    const departments = await query.getMany();
    return departments;
  }

  async getDepartmentById(id: string): Promise<Department> {
    const query = this.createQueryBuilder('department');
    query.where('department.id = :id', { id });
    const department = await query.getOne();
    return department;
  }

  async updateDepartment(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const { name, description } = updateDepartmentDto;
    const department = await this.getDepartmentById(id);
    try {
      department.name = name || department.name;
      department.description = description || department.description;
      await this.update(id, {
        name: department.name,
        description: department.description,
      });
    } catch (error) {
      return error;
    }
    return department;
  }

  async deleteDepartment(id: string): Promise<void> {
    await this.delete(id);
  }
}
