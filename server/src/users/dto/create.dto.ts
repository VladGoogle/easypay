import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';


export class CreateUserDTO {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    phone!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    lastName!: string;

    @IsString()
    @MinLength(4)
    @MaxLength(255)
    password!: string;

    @IsString()
    addressId!: string;
}
