import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentsRepository } from './departments.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(DepartmentsRepository)
    private departmentsRepository: DepartmentsRepository,
  ) {}

  async createDepartment(createDepartmentDto: CreateDepartmentDto) {
    return await this.departmentsRepository.createDepartment(
      createDepartmentDto,
    );
  }

  async getDepartments(): Promise<CreateDepartmentDto[]> {
    return await this.departmentsRepository.getDepartments();
  }

  async findOne(id: string) {
    return await this.departmentsRepository.getDepartmentById(id);
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return await this.departmentsRepository.updateDepartment(
      id,
      updateDepartmentDto,
    );
  }

  async deleteDepartment(id: string) {
    return await this.departmentsRepository.deleteDepartment(id);
  }
}
