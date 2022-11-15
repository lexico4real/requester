import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { RequestTemplatesService } from './request-templates.service';
import { CreateRequestTemplateDto } from './dto/create-request-template.dto';
import { UpdateRequestTemplateDto } from './dto/update-request-template.dto';

@Controller('request-templates')
export class RequestTemplatesController {
  constructor(
    private readonly requestTemplatesService: RequestTemplatesService,
  ) {}

  @Post()
  createRequestTemplate(
    @Body() createRequestTemplateDto: CreateRequestTemplateDto,
  ) {
    return this.requestTemplatesService.createRequestTemplate(
      createRequestTemplateDto,
    );
  }

  @Get()
  getRequestTemplates() {
    return this.requestTemplatesService.getRequestTemplates();
  }

  @Get(':id')
  getRequestTemplateById(@Param('id') id: string) {
    return this.requestTemplatesService.getRequestTemplateById(id);
  }

  @Patch(':id')
  updateRequestTemplate(
    @Param('id') id: string,
    @Body() updateRequestTemplateDto: UpdateRequestTemplateDto,
  ) {
    return this.requestTemplatesService.updateRequestTemplate(
      id,
      updateRequestTemplateDto,
    );
  }
}
