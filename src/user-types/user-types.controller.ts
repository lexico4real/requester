import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserTypesService } from './user-types.service';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user-types')
@UseGuards(AuthGuard())
export class UserTypesController {
  constructor(private readonly userTypesService: UserTypesService) {}

  @Post()
  createUserType(@Body() createUserTypeDto: CreateUserTypeDto) {
    return this.userTypesService.createUserType(createUserTypeDto);
  }

  @Get()
  getUserTypes() {
    return this.userTypesService.getUserTypes();
  }

  @Get(':id')
  getUserTypeById(@Param('id') id: string) {
    return this.userTypesService.getUserTypeById(id);
  }

  @Patch(':id')
  updateUserType(
    @Param('id') id: string,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ) {
    return this.userTypesService.updateUserType(id, updateUserTypeDto);
  }
}
