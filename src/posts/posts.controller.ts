import { Body, Controller, Delete, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto } from './dto/create.post';
import { AuthGuard } from 'src/guard/jwt.guard';
import { UpdatePostDto } from './dto/update.post';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post('/create-post')
  @UseGuards(AuthGuard)
  createPostUser(@Body() postData: PostDto) {
    return this.postsService.createPost(postData)
  }

  @Put('/edit-post/:id')
  @UseGuards(AuthGuard)
  editPostUser(
    @Param('id') id: number,
    @Body() postData: PostDto,
    @Req() req) {
    const userID = req.user

    console.log(userID.id);
    console.log(userID);

    return this.postsService.editPostUser(id, postData, userID)
  }

  @Delete('/delete-post/:postId')
  @UseGuards(AuthGuard)
  deletePostUser(@Param('postId') postId: number, @Req() req) {
    const userId = req.user

    return this.postsService.deletePostUser(postId)
  }
}