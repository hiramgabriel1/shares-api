import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  nameEvent: string;

  @Column('text')
  description: string;

  @Column('int')
  members: number;
}
