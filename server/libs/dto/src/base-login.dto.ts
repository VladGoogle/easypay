import { IsString, MaxLength, MinLength } from 'class-validator';
import { ValidateIfExists } from '@libs/validators';

export class BaseLoginDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  password!: string;

  @ValidateIfExists()
  @IsString()
  fcmToken?: string;
}
