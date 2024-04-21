import { PostEntity } from "src/posts/entities/post.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    comment: string

    @ManyToOne(() => UserEntity, user => user.comments)
    user: UserEntity

    @ManyToOne(() => PostEntity, post => post.comments)
    post: PostEntity
}