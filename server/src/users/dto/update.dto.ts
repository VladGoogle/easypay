import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

import { ValidateIfExists } from '@libs/validators';

export class UpdateUserDTO {
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
    phone?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    email?: string;
}
