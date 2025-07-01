import { IsNumber, Min, Max } from 'class-validator';

export class GameActionDto {
  @IsNumber()
  @Min(0) // Allow 0 for FREE space
  @Max(25)
  cellNumber: number;
}
