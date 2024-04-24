import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { FollowingEntity } from './entities/following.entity';
import { JwtModule } from '@nestjs/jwt';
import { constants } from 'src/constants/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowingEntity]),
    JwtModule.register({
      global: true,
      secret: constants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [FollowingController],
  providers: [FollowingService],
})
export class FollowingModule { }
