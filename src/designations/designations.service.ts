import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DesignationsRepository } from './designations.repository';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';

@Injectable()
export class DesignationsService {
  constructor(
    @InjectRepository(DesignationsRepository)
    private designationsRepository: DesignationsRepository,
  ) {}

  async createDesignation(createDesignationDto: CreateDesignationDto) {
    return await this.designationsRepository.createDesignation(
      createDesignationDto,
    );
  }

  async getDesignations(): Promise<CreateDesignationDto[]> {
    return await this.designationsRepository.getDesignations();
  }

  async findOne(id: string) {
    return await this.designationsRepository.getDesignationById(id);
  }

  async update(id: string, updateDesignationDto: UpdateDesignationDto) {
    return await this.designationsRepository.updateDesignation(
      id,
      updateDesignationDto,
    );
  }

  async deleteDesignation(id: string) {
    return await this.designationsRepository.deleteDesignation(id);
  }
}
