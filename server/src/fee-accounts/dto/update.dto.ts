import {
    IsEnum,
} from 'class-validator';

import {Currency} from "@libs/enums/card";
import {ValidateIfExists} from "@libs/validators";


export class UpdateFeeAccountDTO {
    @ValidateIfExists()
    @IsEnum(Currency)
    currency?: Currency;
}
