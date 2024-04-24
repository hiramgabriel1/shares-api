import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { constants } from 'src/constants/constants';
import { PostEntity } from 'src/posts/entities/post.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupEntity,
      UserEntity,
      PostEntity,
      CommentEntity,
    ]),
    JwtModule.register({
      global: true,
      secret: constants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule { }
