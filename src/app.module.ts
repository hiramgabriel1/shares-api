import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PostsModule } from './posts/posts.module';
import { EventsModule } from './events/events.module';
import { GroupsModule } from './groups/groups.module';
import { AdminModule } from './admin/admin.module';
import { CommentsModule } from './comments/comments.module';
import { ReportsModule } from './reports/reports.module';
import { PostEntity } from './posts/entities/post.entity';
import { CommentEntity } from './comments/entities/comments.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: 'loqueseaalaburguer',
      autoLoadEntities: true,
      entities: [UserEntity, PostEntity, CommentEntity],
      synchronize: true, // ? sincroniza los cambios de las entities
    }),
    TypeOrmModule.forFeature([UserEntity, PostEntity, CommentEntity]),

    UserModule,
    PostsModule,
    EventsModule,
    GroupsModule,
    AdminModule,
    CommentsModule,
    ReportsModule,
  ],

  controllers: [UserController],
  providers: [UserService],
})
export class AppModule { }
