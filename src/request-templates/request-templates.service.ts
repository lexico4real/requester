import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRequestTemplateDto } from './dto/create-request-template.dto';
import { UpdateRequestTemplateDto } from './dto/update-request-template.dto';
import { RequestTemplatesRepository } from './request-templates.repository';

@Injectable()
export class RequestTemplatesService {
  constructor(
    @InjectRepository(RequestTemplatesRepository)
    private readonly requestTemplatesRepository: RequestTemplatesRepository,
  ) {}
  createRequestTemplate(createRequestTemplateDto: CreateRequestTemplateDto) {
    return this.requestTemplatesRepository.createRequestTemplate(
      createRequestTemplateDto,
    );
  }

  getRequestTemplates() {
    return this.requestTemplatesRepository.getRequestTemplates();
  }

  getRequestTemplateById(id: string) {
    return this.requestTemplatesRepository.getRequestTemplateById(id);
  }

  updateRequestTemplate(
    id: string,
    updateRequestTemplateDto: UpdateRequestTemplateDto,
  ) {
    return this.requestTemplatesRepository.updateRequestTemplate(
      id,
      updateRequestTemplateDto,
    );
  }
}
