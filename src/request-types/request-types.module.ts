import { Module } from '@nestjs/common';
import { RequestTypesService } from './request-types.service';
import { RequestTypesController } from './request-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestTypesRepository } from './request-types.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestTypesRepository]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [RequestTypesController],
  providers: [RequestTypesService],
})
export class RequestTypesModule {}
