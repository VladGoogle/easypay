import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

import { ValidateIfExists } from '@libs/validators';

export class UpdateCountryDTO {
    @ValidateIfExists()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ValidateIfExists()
    @IsString()
    @IsNotEmpty()
    code?: string;
}
