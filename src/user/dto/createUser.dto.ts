import { IsArray, IsEmail, IsString } from "class-validator"

export class UserDto {

    @IsString()
    readonly username: string

    @IsEmail()
    readonly email: string

    @IsString()
    readonly password: string

    @IsArray()
    readonly preferences: string[]

    @IsString()
    readonly description: string

    @IsArray()
    readonly tecnologies: string[]
}

  