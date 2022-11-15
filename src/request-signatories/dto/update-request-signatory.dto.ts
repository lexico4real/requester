import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateRequestSignatoryDto } from './create-request-signatory.dto';

export class UpdateRequestSignatoryDto extends PartialType(
  CreateRequestSignatoryDto,
) {
  @IsOptional()
  @IsUUID()
  userId: string;
}
