import {IsEmail} from "class-validator";
import {BaseLoginDTO} from "@libs/dto";

export class AdminLoginDTO extends BaseLoginDTO{
    @IsEmail()
    email!: string;
}