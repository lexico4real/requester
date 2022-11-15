import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRequestTypeDto } from './dto/create-request-type.dto';
import { UpdateRequestTypeDto } from './dto/update-request-type.dto';
import { RequestTypesRepository } from './request-types.repository';

@Injectable()
export class RequestTypesService {
  constructor(
    @InjectRepository(RequestTypesRepository)
    private requestTypesRepository: RequestTypesRepository,
  ) {}

  createRequestType(createRequestTypeDto: CreateRequestTypeDto) {
    return this.requestTypesRepository.createRequestType(createRequestTypeDto);
  }

  getRequestTypes() {
    return this.requestTypesRepository.getRequestTypes();
  }

  getRequestTypeById(id: string) {
    return this.requestTypesRepository.getRequestTypeById(id);
  }

  updateRequestType(id: string, updateRequestTypeDto: UpdateRequestTypeDto) {
    return this.requestTypesRepository.updateRequestType(
      id,
      updateRequestTypeDto,
    );
  }
}
