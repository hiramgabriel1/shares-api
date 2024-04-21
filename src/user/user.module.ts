import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global:true,
      secret: 'DJKEJDKLCJXCM??sd_dskldsjakdasdwdw34341298398894@eeklwew232dkdlmcvgejffejghUIHhJKhFTyfTYjkJLghGHJGJKGgkGkgGJHGgjkghjdFEWeqwESDOWERtYUiOndffvGGBNM',
      signOptions:{ expiresIn: '24h' }
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
