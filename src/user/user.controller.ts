import { Body, Controller, Get, Post, UseGuards, Request, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import { AuthGuard } from 'src/guard/jwt.guard';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post('auth/create-user')
  createUser(@Body() userData: UserDto) {
    return this.userService.createNewUser(userData)
  }

  @Post('auth/login-user')
  loginUser(@Body() userLogin: LoginDto) {
    return this.userService.userLogin(userLogin)
  }

  @Put('user/:id')
  updateUserInfo(@Param('id') id: number, userData: UserDto){
    return this.userService.updateUser(id, userData)
  }

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
    return this.userService.getUserInfo(id)
  }
}
