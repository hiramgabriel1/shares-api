import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  username: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('simple-array')
  preferences: string[];

  @Column('text')
  description: string;

  @Column('simple-array')
  tecnologies: string[];

  @Column({ default: 'normal-user' })
  role: string;

  @OneToMany(() => PostEntity, post => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, comment => comment.user)
  comments: CommentEntity[]
}