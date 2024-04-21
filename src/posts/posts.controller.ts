import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto } from './dto/create.post';
import { AuthGuard } from 'src/guard/jwt.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  getPost() {
    return this.postsService.getPostWithComments();
  }

  @Get('all')
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @Post('/create-post/:userId')
  @UseGuards(AuthGuard)
  createPostUser(@Param('userId') userId: any, @Body() postData: PostDto) {
    return this.postsService.createPost(userId, postData);
  }

  @Put('/edit-post/user/:userId/post/:postId')
  @UseGuards(AuthGuard)
  editPostUser(
    @Param('userId') userId: number,
    @Param('postId') postId: number,
    @Body() postData: PostDto) {

    return this.postsService.editPostUser(userId, postId, postData);
  }

  @Delete('/delete-post/user/:userId/postId/:postId')
  @UseGuards(AuthGuard)
  deletePostUser(
    @Param('postId') postId: any,
    @Param('userId') userId: number,
  ) {
    return this.postsService.deletePostUser(userId, postId);
  }
}
