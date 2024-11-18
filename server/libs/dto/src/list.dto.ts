import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class ListDTO {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(250)
  limit = 25;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset = 0;
}
