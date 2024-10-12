import {
        IsEmail,
        IsNotEmpty,
        IsString,
        MaxLength,
        MinLength,
} from 'class-validator';


export class CreateAdminDTO {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

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
}
