import { PartialType } from '@nestjs/swagger';
import { CreateRequestDto } from './create-request.dto';

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  subject: string;

  body: string;

  requestTypeId: string;

  signatoryIds: string[];

  userId: string;

  isComplete: boolean;
}
