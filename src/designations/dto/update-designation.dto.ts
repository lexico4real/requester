import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateDesignationDto } from './create-designation.dto';

export class UpdateDesignationDto extends PartialType(CreateDesignationDto) {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;
}
