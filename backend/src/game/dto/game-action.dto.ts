import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class GameActionDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  playerId: string;

  @IsNumber()
  @Min(1)
  @Max(25)
  cellNumber: number;
}
