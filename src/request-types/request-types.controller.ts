import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RequestTypesService } from './request-types.service';
import { CreateRequestTypeDto } from './dto/create-request-type.dto';
import { UpdateRequestTypeDto } from './dto/update-request-type.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('request-types')
@UseGuards(AuthGuard())
export class RequestTypesController {
  constructor(private readonly requestTypesService: RequestTypesService) {}

  @Post()
  createRequestType(@Body() createRequestTypeDto: CreateRequestTypeDto) {
    return this.requestTypesService.createRequestType(createRequestTypeDto);
  }

  @Get()
  getRequestTypes() {
    return this.requestTypesService.getRequestTypes();
  }

  @Get(':id')
  getRequestTypeById(@Param('id') id: string) {
    return this.requestTypesService.getRequestTypeById(id);
  }

  @Patch(':id')
  updateRequestType(
    @Param('id') id: string,
    @Body() updateRequestTypeDto: UpdateRequestTypeDto,
  ) {
    return this.requestTypesService.updateRequestType(id, updateRequestTypeDto);
  }
}
