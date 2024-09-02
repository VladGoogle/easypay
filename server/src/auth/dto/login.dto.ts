import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";
import {ValidateIfExists} from "@libs/validators";

export class LoginDTO {
    @ValidateIfExists()
    @IsEmail()
    email?: string;

    @ValidateIfExists()
    @IsString()
    phone?: string;

    @IsString()
    @MinLength(4)
    @MaxLength(255)
    password!: string;
}