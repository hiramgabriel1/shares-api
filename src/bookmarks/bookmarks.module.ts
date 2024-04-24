import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkEntity } from './entities/bookmark.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { constants } from 'src/constants/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity, UserEntity, PostEntity]),
    JwtModule.register({
      global: true,
      secret: constants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule { }
