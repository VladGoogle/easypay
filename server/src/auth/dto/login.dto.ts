import {IsEmail, IsString} from "class-validator";
import {ValidateIfExists} from "@libs/validators";
import {BaseLoginDTO} from "@libs/dto";

export class UserLoginDTO extends BaseLoginDTO {
    @ValidateIfExists()
    @IsEmail()
    email?: string;

    @ValidateIfExists()
    @IsString()
    phone?: string;
}