import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateRequestTypeDto } from './create-request-type.dto';

export class UpdateRequestTypeDto extends PartialType(CreateRequestTypeDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
