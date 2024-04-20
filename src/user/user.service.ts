import {
    BadRequestException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { UserDto } from './dto/createUser.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

    async createNewUser(userData: UserDto) {
        try {
            const encryptPassword = await bcrypt.hash(userData.password, 10);
            const userIsAlreadyExistsInDatabase = await this.userRepository.findOne({
                where: [
                    { email: userData.email },
                    { username: userData.username },
                ],
            });

            if (userIsAlreadyExistsInDatabase) {
                console.error('Usuario ya existe en la base de datos');
                throw new BadRequestException(
                    'El usuario ya existe',
                );
            }

            const instanceUserInDatabase = this.userRepository.create({
                ...userData,
                password: encryptPassword
            })

            if (instanceUserInDatabase) {
                return await this.userRepository.save(instanceUserInDatabase)
            }
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Error al crear el usuario');
        }
    }

    async userLogin(userLogin: LoginDto) {
        try {
            const userFindToLogin = await this.userRepository.findOne({
                where: {
                    email: userLogin.email
                }
            });

            if (!userFindToLogin) {
                throw new UnauthorizedException('Usuario no existe');
            }

            const isPasswordValid = await bcrypt.compare(userLogin.password, userFindToLogin.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Contraseña incorrecta');
            }

            const payload = { name: userFindToLogin.username, email: userFindToLogin.email };
            const token = await this.jwtService.signAsync(payload);

            return { token };
        } catch (error) {
            throw error;
        }
    }
}