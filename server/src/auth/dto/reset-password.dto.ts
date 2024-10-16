import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class ResetPasswordDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    newPassword!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    repeatedPassword!: string;
}