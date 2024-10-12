import {
    IsEnum,
} from 'class-validator';
import {Currency} from "@libs/enums/card";

export class CreateFeeAccountDTO {
    @IsEnum(Currency)
    currency!: Currency;
}
