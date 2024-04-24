import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
import { CreateEventDto } from './dto/createEvent.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async searchUser(userId: number) {
    const userIsAlreadyExistsInDatabase = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!userIsAlreadyExistsInDatabase)
      throw new ForbiddenException('el usuario no existe');
  }

  async validateIfUserExists(userId: number) {
    const userIsAlreadyExistsInDatabase = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (userIsAlreadyExistsInDatabase)
      throw new ForbiddenException('El usuario ya existe');
  }

  async renderUsersWithPosts() {
    const findPosts = await this.userRepository.find({
      relations: ['posts', 'comments'],
    });

    console.log(findPosts);

    let p = findPosts.filter((post) => post.posts.length >= 1);

    return p;
  }

  //#region render users
  async renderUsers() {
    const findPosts = await this.userRepository.find({
      relations: ['posts', 'comments', 'events', 'groups'],
    });

    console.log(findPosts);

    // let p = findPosts.filter((post) => post.posts.length >= 1)

    return findPosts;
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
      await this.sendEmailConfirmUser(email);

      const validateIfUserAlreadyExistsInDatabase =
        await this.userRepository.findOne({
          where: [{ username: userData.username }, { email: userData.email }],
        });

      if (validateIfUserAlreadyExistsInDatabase)
        throw new BadRequestException('el usuario ya existe alaburguer');

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
          id: this.userRepository.getId,
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
        userId: userFindToLogin.id,
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

  // ! pendiente
  async updateUser(userId: number, updateUser: UpdateUserDto) {
    try {
      await this.validateIfUserExists(userId);

      const newDataUser = {
        username: updateUser.username,
        email: updateUser.email,
        password: updateUser.password,
        preferences: updateUser.preferences,
        description: updateUser.description,
        tecnologies: updateUser.tecnologies,
        role: updateUser.role,
      };

      const instanceUserToUpdate = await this.userRepository.update(
        userId,
        newDataUser,
      );

      if (!instanceUserToUpdate)
        throw new BadRequestException(`error al actualizar ${userId}`);

      return {
        message: `usuario actualizado ${userId}`,
        details: instanceUserToUpdate,
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
        id: userId,
      },
    });

    return findPosts;
  }

  async createEvent(userId: number, eventBody: CreateEventDto) {
    try {
      await this.searchUser(userId);

      const getUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      const instanceNewEvent = {
        user: getUser,
        ...eventBody,
      };
      const newEventUser = this.userRepository.create(instanceNewEvent);

      if (!newEventUser) throw new BadRequestException('error en los datos');

      if (newEventUser) {
        return {
          message: 'event created',
          details: instanceNewEvent,
          data: newEventUser,
        };
      }

      throw new InternalServerErrorException('error interno');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
