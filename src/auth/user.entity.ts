import { BaseEntity } from './../base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from '../departments/entities/department.entity';
import { Designation } from '../designations/entities/designation.entity';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  otherName: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Designation, (designation) => designation.userIds)
  designationId: string;

  @ManyToOne(() => Department, (department) => department.userIds)
  departmentId: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ enum: ['MALE', 'FEMALE'] })
  gender: string;

  @Column({ nullable: true })
  managerId: string;

  @Column({ nullable: true })
  signature: string;

  @Column({ nullable: true })
  userTypeId: string;

  @Column()
  password: string;
}
