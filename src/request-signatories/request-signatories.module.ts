import { Module } from '@nestjs/common';
import { RequestSignatoriesService } from './request-signatories.service';
import { RequestSignatoriesController } from './request-signatories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestSignatoriesRepository } from './request-signatories.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestSignatoriesRepository]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [RequestSignatoriesController],
  providers: [RequestSignatoriesService],
})
export class RequestSignatoriesModule {}
