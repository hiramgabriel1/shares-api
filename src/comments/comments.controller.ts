import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { AuthGuard } from 'src/guard/jwt.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post('/create-comment/:id')
  @UseGuards(AuthGuard)
  createComment(@Param('id') id: number, @Body() comment: CreateCommentDto) {
    return this.commentsService
  }
}