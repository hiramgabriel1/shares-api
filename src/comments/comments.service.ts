import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comments.entity';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,

    ) { }


    async createComment(userId: any, postId: any, commentData: any) {
        try {
            const searchUser = await this.userRepository.findOne({
                where: {
                    id: userId
                }
            });
            const searchPost = await this.postRepository.findOne({
                where: {
                    id: postId
                }
            });

            if (!searchUser) throw new ForbiddenException('No existe un usuario con ese ID');
            if (!searchPost) throw new ForbiddenException('El post no existe');

            const newComment = this.commentRepository.create({
                user: searchUser,
                post: searchPost,
                comment: commentData,
            });

            const savedComment = await this.commentRepository.save(newComment);

            return {
                message: `Comentario creado en el post ${searchPost.id}`,
                comment: savedComment,
            };
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async searchComments() {
        const data = await this.commentRepository.find({
            relations: ['post']
        })

        return data
    }

}
