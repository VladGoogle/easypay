import {
    IsEnum,
    IsNotEmpty, IsNumber, IsOptional,
} from 'class-validator';

import {Currency} from "@libs/enums/card";
import {TransactionType} from "@libs/enums/transaction";
import {ValidateIfExists} from "@libs/validators";

export class CreateFeeRuleDTO {
    @IsEnum(TransactionType)
    @IsNotEmpty()
    type!: TransactionType;

    @IsEnum(Currency)
    @IsNotEmpty()
    currency!: Currency;

    @ValidateIfExists()
    @IsOptional()
    @IsNumber()
    fixedRate?: number;

    @ValidateIfExists()
    @IsOptional()
    @IsNumber()
    taxPercent?: number;
}
