import { User } from 'src/auth/user.entity';
import { BaseEntity } from 'src/base.entity';
import { RequestSignatory } from 'src/request-signatories/entities/request-signatory.entity';
import { RequestType } from 'src/request-types/entities/request-type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Request extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column()
  body: string;

  @OneToOne(() => RequestType)
  @JoinColumn()
  requestTypeId: string;

  @ManyToMany(() => RequestSignatory)
  @JoinTable()
  signatoryIds: string[];

  @Column()
  userId: User;

  @Column({ default: false })
  isComplete: boolean;
}
