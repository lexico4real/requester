import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RequestSignatoriesService } from './request-signatories.service';
import { CreateRequestSignatoryDto } from './dto/create-request-signatory.dto';
import { UpdateRequestSignatoryDto } from './dto/update-request-signatory.dto';

@Controller('request-signatories')
export class RequestSignatoriesController {
  constructor(
    private readonly requestSignatoriesService: RequestSignatoriesService,
  ) {}

  @Post()
  createRequestSignatory(
    @Body() createRequestSignatoryDto: CreateRequestSignatoryDto,
  ) {
    return this.requestSignatoriesService.createRequestSignatory(
      createRequestSignatoryDto,
    );
  }

  @Get()
  getRequestSignatories() {
    return this.requestSignatoriesService.getRequestSignatories();
  }

  @Get(':id')
  getRequestSignatoryById(@Param('id') id: string) {
    return this.requestSignatoriesService.getRequestSignatoryById(id);
  }

  @Patch(':id')
  updateRequestSignatory(
    @Param('id') id: string,
    @Body() updateRequestSignatoryDto: UpdateRequestSignatoryDto,
  ) {
    return this.requestSignatoriesService.updateRequestSignatory(
      id,
      updateRequestSignatoryDto,
    );
  }
}
