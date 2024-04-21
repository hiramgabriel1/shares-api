import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { constants } from 'src/constants/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global:true,
      secret: 'DJKEJDKLCJXCM??sd_dskldsjakdasdwdw34341298398894@eeklwew232dkdlmcvgejffejghUIHhJKhFTyfTYjkJLghGHJGJKGgkGkgGJHGgjkghjdFEWeqwESDOWERtYUiOndffvGGBNM ',
      signOptions:{ expiresIn: '1h' }
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
