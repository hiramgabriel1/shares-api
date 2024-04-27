import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  readonly nameEvent: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

}