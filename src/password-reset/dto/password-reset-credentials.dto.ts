/* eslint-disable prettier/prettier */
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class PasswordResetCredentialsDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  token: string;

  @IsUUID()
  @IsString()
  userId: string;

  @IsBoolean()
  isVerified: boolean;

  @IsBoolean()
  isExpired: boolean;
}
