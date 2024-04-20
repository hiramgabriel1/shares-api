import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
// import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
// import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),

    UserModule,
    // AuthModule,
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: 'loqueseaalaburguer',
      autoLoadEntities: true,
      entities: [UserEntity],
      synchronize: true, // ? sincroniza los cambios de las entities
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],

  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
