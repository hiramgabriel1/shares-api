import { UserDto } from "./createUser.dto";

export class UpdateUserDto implements UserDto{
    username: string;
    email: string;
    password: string;
    preferences: string[];
    description: string;
    tecnologies: string[];
    role: string
}