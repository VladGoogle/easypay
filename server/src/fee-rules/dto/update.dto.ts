import {
    IsNumber,
} from 'class-validator';

import {ValidateIfExists} from "@libs/validators";

export class UpdateFeeRuleDTO {
    @ValidateIfExists()
    @IsNumber()
    fixedRate?: number;

    @ValidateIfExists()
    @IsNumber()
    taxPercent?: number;
}
