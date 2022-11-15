import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsUUID()
  requestTypeId: string;

  @IsUUID('4', { each: true })
  signatoryIds: string[];

  @IsUUID()
  userId: string;

  @IsBoolean()
  isComplete: boolean;
}
