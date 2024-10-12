import {IsString, MaxLength, MinLength} from "class-validator";

export class BaseLoginDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(255)
    password!: string;
}