import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comments.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create.comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>
    ) { }

    async createComment(comment: CreateCommentDto) {
        try {
            return comment
            
        } catch (error) {
        }
    }

}
