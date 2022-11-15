import { User } from '../../auth/user.entity';
import { BaseEntity } from '../../base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RequestSignatory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  userId: string;

  @Column({ default: false })
  isApproved: string;
}
