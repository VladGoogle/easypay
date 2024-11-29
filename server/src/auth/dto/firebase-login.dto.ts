import { IsString } from 'class-validator';
import { ValidateIfExists } from '@libs/validators';

export class FirebaseLoginDTO {
  @IsString()
  token!: string;

  @ValidateIfExists()
  @IsString()
  fcmToken?: string;
}
