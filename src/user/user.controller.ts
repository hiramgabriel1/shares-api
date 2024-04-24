import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import { AuthGuard } from 'src/guard/jwt.guard';
import { CreateEventDto } from './dto/createEvent.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(AuthGuard)
  profile(
    @Request()
    req,
  ) {
    console.log(req.user);

    return req.user;
  }

  @Get('user/:id')
  findUser(@Param('id') id: number) {
    return this.userService.getUserInfo(id);
  }

  @Get('users')
  users() {
    return this.userService.renderUsers();
  }

  @Get('users/posts')
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

  @Post('')
  @UseGuards(AuthGuard)
  userCreateEvent(
    @Param('userId') userId: number,
    @Body() eventBody: CreateEventDto
  ) {
    return this.userService.createEvent(userId, eventBody);
  }

  @Put('user/:id')
  @UseGuards(AuthGuard)
  updateUserInfo(@Param('id') id: number, userData: any) {
    return this.userService.updateUser(id, userData);
  }
}
