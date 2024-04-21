import { IsNotEmpty, IsString } from "class-validator";

export class PostDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string

    @IsString()
    @IsNotEmpty()
    readonly description: string
}