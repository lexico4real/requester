import { IsOptional, IsString } from 'class-validator';

export class CreateUserTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
