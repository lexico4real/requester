import { Module } from '@nestjs/common';
import { RequestTemplatesService } from './request-templates.service';
import { RequestTemplatesController } from './request-templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestTemplatesRepository } from './request-templates.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestTemplatesRepository]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [RequestTemplatesController],
  providers: [RequestTemplatesService],
})
export class RequestTemplatesModule {}
