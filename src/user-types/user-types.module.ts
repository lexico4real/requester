import { Module } from '@nestjs/common';
import { UserTypesService } from './user-types.service';
import { UserTypesController } from './user-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypesRepository } from './user-types.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypesRepository]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [UserTypesController],
  providers: [UserTypesService],
})
export class UserTypesModule {}
