import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DesignationsService } from './designations.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';

@Controller('designations')
@UseGuards(AuthGuard())
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Post()
  async create(@Body() createDesignationDto: CreateDesignationDto) {
    return await this.designationsService.createDesignation(
      createDesignationDto,
    );
  }

  @Get()
  async findAll() {
    return await this.designationsService.getDesignations();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.designationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDesignationDto: UpdateDesignationDto,
  ) {
    return await this.designationsService.update(id, updateDesignationDto);
  }
}
