import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { AuthGuard } from 'src/guard/jwt.guard';

@Controller()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('savebookmark/:postID/:userID')
  @UseGuards(AuthGuard)
  saveBookmark(
    @Param('postID') postID: number,
    @Param('userID') userID: number,
  ) {
    return this.bookmarksService.saveBookmark(postID, userID);
  }

  @Delete('bookmarks/delete/:postID/:userID')
  @UseGuards(AuthGuard)
  deleteBookmark(
    @Param('postID') postID: number,
    @Param('userID') userID: number,
  ) {
    return this.bookmarksService.deleteBookmark(postID, userID);
  }

  @Get('show-bookmarks/:userID')
  @UseGuards(AuthGuard)
  getBookmark(@Param('userID') userID: number) {
    return this.bookmarksService.getBookmarks(userID);
  }

  @Put('bookmark-modify/:postID/user/:userID')
  modifyBookmark(
    @Param('postID') postID: number,
    @Param('userID') userID: number,
    @Body() bodyBookmark: any,
  ) {
    return this.bookmarksService.editBookmark(postID, userID, bodyBookmark);
  }
}