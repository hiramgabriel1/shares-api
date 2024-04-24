import { CommentEntity } from 'src/comments/entities/comments.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GroupEntity {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('text')
    groupTitle: string;

    @Column('text')
    groupDescription: string;

    @Column('text')
    groupType: string;

    @Column('text')
    groupRules: string;

    @ManyToOne(() => UserEntity, (user) => user.groups)
    user: UserEntity;

    @ManyToOne(() => PostEntity, (posts) => posts.groups)
    posts: PostEntity;

    @ManyToOne(() => CommentEntity, comments => comments)
    commentsPostsGroup: CommentEntity
}
