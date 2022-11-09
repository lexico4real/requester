import { User } from 'src/auth/user.entity';
import { BaseEntity } from 'src/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Designation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: 'NA' })
  description: string;

  @OneToMany(() => User, (user) => user.designationId)
  userIds: User[];
}
