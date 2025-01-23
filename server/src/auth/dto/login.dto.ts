import { IsEmail, IsString } from 'class-validator';
import { ValidateIfExists } from '@libs/validators';
import { BaseLoginDTO } from '@libs/dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDTO extends BaseLoginDTO {
  @ApiProperty({
    type: String,
    nullable: true,
  })
  @ValidateIfExists()
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @ValidateIfExists()
  @IsString()
  phone?: string;
}
