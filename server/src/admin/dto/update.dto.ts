import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

import { ValidateIfExists } from '@libs/validators';

export class UpdateAdminDTO {
    @ValidateIfExists()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    firstName?: string;

    @ValidateIfExists()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    lastName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    email?: string;
}
