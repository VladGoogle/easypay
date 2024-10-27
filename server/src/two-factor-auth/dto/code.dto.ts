import {IsString} from "class-validator";

export class TwoFactorAuthenticationCodeDTO {
    @IsString()
    code: string;
}