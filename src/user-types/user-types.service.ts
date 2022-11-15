import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { UserTypesRepository } from './user-types.repository';

@Injectable()
export class UserTypesService {
  constructor(
    @InjectRepository(UserTypesRepository)
    private userTypesRepository: UserTypesRepository,
  ) {}
  createUserType(createUserTypeDto: CreateUserTypeDto) {
    return this.userTypesRepository.createUserType(createUserTypeDto);
  }

  getUserTypes() {
    return this.userTypesRepository.getUserTypes();
  }

  getUserTypeById(id: string) {
    return this.userTypesRepository.getUserTypeById(id);
  }

  updateUserType(id: string, updateUserTypeDto: UpdateUserTypeDto) {
    return this.userTypesRepository.updateUserType(id, updateUserTypeDto);
  }
}
