import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  currentPassword!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  newPassword!: string;
}
