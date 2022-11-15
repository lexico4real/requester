import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateRequestTemplateDto } from './create-request-template.dto';

export class UpdateRequestTemplateDto extends PartialType(
  CreateRequestTemplateDto,
) {
  @IsOptional()
  name: string;

  @IsOptional()
  subject: string;

  @IsOptional()
  body: string;

  @IsOptional()
  requestTypeId: string;

  @IsOptional()
  signatoryIds: string[];
}
