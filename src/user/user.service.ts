import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from './dto/createUser.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { transporter } from './email.validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) { }

  async validateIfUserExists(user: UserDto) {
    const userIsAlreadyExistsInDatabase = await this.userRepository.findOne({
      where: [{ email: user.email }, { username: user.username }],
    });

    if (userIsAlreadyExistsInDatabase)
      throw new BadRequestException('El usuario ya existe');
  }

  async sendEmailConfirmUser(email: string) {
    try {
      const info = await transporter.sendMail({
        from: `"Maddison Foo Koch 👻" <${process.env.EMAIL_PROVIDER}>`,
        to: `${email}`,
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>',
      });

      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createNewUser(userData: UserDto) {
    try {
      const { email } = userData;
      await this.validateIfUserExists(userData);
      await this.sendEmailConfirmUser(email);

      const encryptPassword = await bcrypt.hash(userData.password, 10);
      const instanceUserInDatabase = this.userRepository.create({
        ...userData,
        password: encryptPassword,
      });
      const userCreated = await this.userRepository.save(
        instanceUserInDatabase,
      );

      if (instanceUserInDatabase) {
        return {
          message: 'user created',
          details: userCreated,
          ID: this.userRepository.getId,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async userLogin(userLogin: LoginDto) {
    try {
      const userFindToLogin = await this.userRepository.findOne({
        where: {
          email: userLogin.email,
        },
      });

      if (!userFindToLogin)
        throw new UnauthorizedException('Usuario no existe');

      const isPasswordValid = await bcrypt.compare(
        userLogin.password,
        userFindToLogin.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      const payload = {
        name: userFindToLogin.username,
        email: userFindToLogin.email,
        roleUser: userFindToLogin.role,
      };

      return {
        token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: number, updateUser: UpdateUserDto) {
    try {
      await this.validateIfUserExists(updateUser);

      const instanceUserToUpdate = this.userRepository.update(
        userId,
        updateUser,
      );

      if (!instanceUserToUpdate)
        throw new BadRequestException(`error al actualizar ${userId}`);

      return {
        message: `usuario actualizado ${userId}`,
        details: updateUser,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async getUserInfo(userId: number) {
    const find = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!find) throw new BadRequestException('user is not found');

    const findPosts = await this.userRepository.findOne({
      relations: ['posts', 'comments'],
      where: {
        id: userId
      }
    })

    return findPosts

  }
}
