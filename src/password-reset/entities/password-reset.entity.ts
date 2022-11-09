/* eslint-disable prettier/prettier */
import { BaseEntity } from 'src/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PasswordReset extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ unique: true })
  token: string;

  @Column()
  isVerified: boolean;

  @Column({ default: false })
  isExpired: boolean;

  @Column()
  userId: string;
}
