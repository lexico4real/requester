import { IsString, IsOptional } from 'class-validator';

export class CreateRequestTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
