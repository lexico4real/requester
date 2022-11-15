import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserTypeDto } from './create-user-type.dto';

export class UpdateUserTypeDto extends PartialType(CreateUserTypeDto) {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
