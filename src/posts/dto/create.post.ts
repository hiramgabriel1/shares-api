import { IsNotEmpty, IsString } from "class-validator";

export class CreatePost {
    @IsString()
    readonly title: string

    @IsString()
    @IsNotEmpty()
    readonly description: string

    // @IsString()
    // @IsNotEmpty()
    // readonly 
}