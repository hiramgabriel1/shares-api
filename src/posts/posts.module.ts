import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    JwtModule.register({
      global:true,
      secret: 'DJKEJDKLCJXCM??sd_dskldsjakdasdwdw34341298398894@eeklwew232dkdlmcvgejffejghUIHhJKhFTyfTYjkJLghGHJGJKGgkGkgGJHGgjkghjdFEWeqwESDOWERtYUiOndffvGGBNM',
      signOptions:{ expiresIn: '24h' }
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})

export class PostsModule {}