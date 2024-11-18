import {
    ArrayMaxSize,
    IsEnum,
    IsIn,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

import { SplitToArray } from '@libs/decorators';
import { ListDTO } from '@libs/dto';
import { HasUniqueItems, ValidateIfExists } from '@libs/validators';
import { AccountStatus, Currency } from '@libs/enums/accounts';

const includeFields = ['country', 'user'] as const;

export class ListBeneficiariesDTO extends ListDTO {
    @ValidateIfExists()
    @IsUUID()
    userId?: string;

    @ValidateIfExists()
    @IsString()
    phone?: string;

    @ValidateIfExists()
    @IsString()
    accountNumber?: string;

    @ValidateIfExists()
    @IsString()
    bic?: string;

    @ValidateIfExists()
    @IsString()
    iban?: string;

    @ValidateIfExists()
    @IsString()
    sortCode?: string;

    @ValidateIfExists()
    @IsEnum(Currency)
    currency?: Currency;

    @ValidateIfExists()
    @IsEnum(AccountStatus)
    status?: AccountStatus;

    @IsOptional()
    @SplitToArray()
    @ArrayMaxSize(includeFields.length)
    @HasUniqueItems()
    @IsIn(includeFields, { each: true })
    include?: string[] = [];
}
