import {
    IsNotEmpty, IsOptional,
    IsString, IsUUID,
    MaxLength,
} from 'class-validator';
import {UserType} from "@libs/enums/user";


export class CreateAddressDTO {
    @IsUUID()
    @IsNotEmpty()
    @MaxLength(50)
    countryId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    district!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    city!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    firstStreetLine!: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    secondStreetLine?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    postCode!: UserType;
}
