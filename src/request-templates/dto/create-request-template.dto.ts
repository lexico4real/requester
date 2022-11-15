import { IsString, IsUUID } from 'class-validator';

export class CreateRequestTemplateDto {
  @IsString()
  name: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsUUID()
  requestTypeId: string;

  // @IsUUID()
  signatoryIds: string[];
}
