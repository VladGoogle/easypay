import { IsNotEmpty, IsString } from 'class-validator';

export class GetAppTokenDTO {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  levelName!: string;
}
