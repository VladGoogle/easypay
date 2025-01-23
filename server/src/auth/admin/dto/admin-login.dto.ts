import { IsEmail } from 'class-validator';
import { BaseLoginDTO } from '@libs/dto';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDTO extends BaseLoginDTO {
  @ApiProperty({ type: String })
  @IsEmail()
  email!: string;
}
