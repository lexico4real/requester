import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import Mailer from 'config/mail/mailer';
import { UsersRepository } from '../auth/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset])],
  providers: [PasswordResetService, Mailer, UsersRepository],
  controllers: [PasswordResetController],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
