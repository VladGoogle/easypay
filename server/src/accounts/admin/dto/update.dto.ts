import { IsEnum, IsString } from 'class-validator';

import { AccountStatus } from '@libs/enums/accounts';
import { ValidateIfExists } from '@libs/validators';

export class AdminUpdateAccountDTO {
  @ValidateIfExists()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @ValidateIfExists()
  @IsString()
  resubmissionReason?: string;
}
