import { BaseEntity } from 'src/base.entity';
import { RequestTemplate } from 'src/request-templates/entities/request-template.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequestType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(
    () => RequestTemplate,
    (requestTemplate) => requestTemplate.requestTypeId,
  )
  requestTemplateId: RequestTemplate[];
}
