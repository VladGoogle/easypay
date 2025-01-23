import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  newPassword!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  repeatedPassword!: string;
}
