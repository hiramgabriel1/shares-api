import { IsNotEmpty, IsString } from "class-validator";

export class CreateReportDto {
    @IsString()
    @IsNotEmpty()
    readonly titleReport: string

    @IsString()
    @IsNotEmpty()
    readonly description: string
}