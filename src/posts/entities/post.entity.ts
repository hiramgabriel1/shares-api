import { CommentEntity } from 'src/comments/entities/comments.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => UserEntity, user => user.posts)
  user: UserEntity;

  @OneToMany(() => CommentEntity, post => post.comment)
  comments: CommentEntity[]

}