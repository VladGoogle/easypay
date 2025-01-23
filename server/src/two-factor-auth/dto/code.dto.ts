import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TwoFactorAuthenticationCodeDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  code: string;
}
