import { IsString } from "class-validator";

export class BookmarkDto {
    @IsString()
    readonly bookmarkName: string
}