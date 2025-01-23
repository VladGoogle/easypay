import { IsString, MaxLength, MinLength } from 'class-validator';
import { ValidateIfExists } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

export class BaseLoginDTO {
  @ApiProperty({
    type: String,
    nullable: false,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  password!: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @ValidateIfExists()
  @IsString()
  fcmToken?: string;
}
