import { IsUUID } from 'class-validator';

export class CreateRequestSignatoryDto {
  @IsUUID()
  userId: string;
}
