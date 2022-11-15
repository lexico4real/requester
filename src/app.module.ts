import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { BarcodeModule } from './barcode/barcode.module';
import { typeOrmConfig } from '../config/orm/global';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { DepartmentsModule } from './departments/departments.module';
import { DesignationsModule } from './designations/designations.module';
import { UserTypesModule } from './user-types/user-types.module';
import { RequestTypesModule } from './request-types/request-types.module';
import { RequestSignatoriesModule } from './request-signatories/request-signatories.module';
import { RequestTemplatesModule } from './request-templates/request-templates.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({ ...typeOrmConfig, autoLoadEntities: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    HealthModule,
    BarcodeModule,
    PasswordResetModule,
    DepartmentsModule,
    DesignationsModule,
    UserTypesModule,
    RequestTypesModule,
    RequestSignatoriesModule,
    RequestTemplatesModule,
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
