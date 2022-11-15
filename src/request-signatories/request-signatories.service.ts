import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRequestSignatoryDto } from './dto/create-request-signatory.dto';
import { UpdateRequestSignatoryDto } from './dto/update-request-signatory.dto';
import { RequestSignatoriesRepository } from './request-signatories.repository';

@Injectable()
export class RequestSignatoriesService {
  constructor(
    @InjectRepository(RequestSignatoriesRepository)
    private requestSignatoriesRepository: RequestSignatoriesRepository,
  ) {}
  createRequestSignatory(createRequestSignatoryDto: CreateRequestSignatoryDto) {
    return this.requestSignatoriesRepository.createRequestSignatory(
      createRequestSignatoryDto,
    );
  }

  getRequestSignatories() {
    return this.requestSignatoriesRepository.getRequestSignatories();
  }

  getRequestSignatoryById(id: string) {
    return this.requestSignatoriesRepository.getRequestSignatoryById(id);
  }

  updateRequestSignatory(
    id: string,
    updateRequestSignatoryDto: UpdateRequestSignatoryDto,
  ) {
    return this.requestSignatoriesRepository.updateRequestSignatory(
      id,
      updateRequestSignatoryDto,
    );
  }
}
