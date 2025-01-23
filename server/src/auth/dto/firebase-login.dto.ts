import { IsString } from 'class-validator';
import { ValidateIfExists } from '@libs/validators';
import { ApiProperty } from '@nestjs/swagger';

export class FirebaseLoginDTO {
  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  token!: string;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  @ValidateIfExists()
  @IsString()
  fcmToken?: string;
}
