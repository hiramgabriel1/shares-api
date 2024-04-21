import { Body, Controller, Param, Post, UseGuards, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { AuthGuard } from 'src/guard/jwt.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post('/create-comment/:userId/:postId')
  @UseGuards(AuthGuard)
  createComment(
    @Param('postId') postId: number,
    @Param('userId') userId: number,
    @Body() comment: CreateCommentDto) {
    return this.commentsService.createComment(userId, postId, comment)
  }

  @Get()
  search() {
    return this.commentsService.searchComments()
  }
}