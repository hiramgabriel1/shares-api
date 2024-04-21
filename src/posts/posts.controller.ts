import { Body, Controller, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
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
    @Req() req: any) {
    const userID = req.user

    console.log(userID);
    
    return this.postsService.editPostUser(id, postData, userID)
  }
}