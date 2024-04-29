import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { AuthGuard } from 'src/guard/jwt.guard';

@Controller()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('savebookmark/:postID/:userID')
  // @UseGuards(AuthGuard)
  saveBookmark(
    @Param('postID') postID: number,
    @Param('userID') userID: number,
  ) {
    return this.bookmarksService.saveBookmark(postID, userID)
  }
}
