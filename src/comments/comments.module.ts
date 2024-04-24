import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comments.entity';
import { JwtModule } from '@nestjs/jwt';
import { constants } from 'src/constants/constants';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { GroupEntity } from 'src/groups/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      UserEntity,
      PostEntity,
      GroupEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: constants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
