import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  nameEvent: string;

  @Column('text')
  description: string;

  // unimos la tabla de usuario con la de eventos
  @ManyToOne(() => UserEntity, user => user.events)
  user: UserEntity
}
