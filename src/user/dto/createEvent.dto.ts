import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly nameEvent: string;

  @IsString()
  readonly description: string;
}
