import {
    IsNotEmpty,
    IsOptional,
    IsString, IsUUID,
    MaxLength,
} from 'class-validator';

import { ValidateIfExists } from '@libs/validators';

export class UpdateAddressDTO {
    @ValidateIfExists()
    @IsUUID()
    @IsNotEmpty()
    @MaxLength(50)
    countryId?: string;

    @ValidateIfExists()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    district?: string;

    @ValidateIfExists()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    city?: string;

    @ValidateIfExists()
    @IsString()
    @IsOptional()
    @MaxLength(255)
    firstStreetLine?: string;

    @ValidateIfExists()
    @IsString()
    @IsOptional()
    @MaxLength(255)
    secondStreetLine?: string;

    @ValidateIfExists()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    postCode?: string;
}
