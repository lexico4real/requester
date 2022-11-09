import { Module } from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { DesignationsController } from './designations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DesignationsRepository } from './designations.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([DesignationsRepository]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [DesignationsController],
  providers: [DesignationsService],
})
export class DesignationsModule {}
