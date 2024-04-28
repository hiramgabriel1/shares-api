import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import { AuthGuard } from 'src/guard/jwt.guard';
import { CreateEventDto } from './dto/createEvent.dto';
import { EventsService } from 'src/events/events.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventsService,
  ) { }

  @Get('events')
  @UseInterceptors(CacheInterceptor)
  events() {
    return this.eventService.getEvents();
  }

  @Get('info')
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  profile(
    @Request()
    req,
  ) {
    console.log(req.user);

    return req.user;
  }

  @Get('user/:id')
  @UseInterceptors(CacheInterceptor)
  // @CacheKey('custom_key')
  // @CacheTTL(20)
  findUser(@Param('id') id: number) {
    return this.userService.getUserInfo(id);
  }

  @Get('users')
  @UseInterceptors(CacheInterceptor)
  // @CacheKey('custom_key')
  // @CacheTTL(20)
  users() {
    return this.userService.renderUsers();
  }

  @Get('users/posts')
  @UseInterceptors(CacheInterceptor)
  // @CacheKey('custom_key')
  // @CacheTTL(20)
  usersWithPost() {
    return this.userService.renderUsersWithPosts();
  }

  @Post('auth/create-user')
  createUser(@Body() userData: any) {
    return this.userService.createNewUser(userData);
  }

  @Post('auth/login-user')
  loginUser(@Body() userLogin: LoginDto) {
    return this.userService.userLogin(userLogin);
  }

  @Post('users/create-event/:userId')
  @UseGuards(AuthGuard)
  userCreateEvent(@Param('userId') userId: number, @Body() eventBody: any) {
    return this.eventService.createEventUser(userId, eventBody);
  }

  @Put('user/:id')
  @UseGuards(AuthGuard)
  updateUserInfo(@Param('id') id: number, userData: any) {
    return this.userService.updateUser(id, userData);
  }
}
