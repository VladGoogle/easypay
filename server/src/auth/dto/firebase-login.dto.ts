import { IsString } from "class-validator";

export class FirebaseLoginDTO {
    @IsString()
    token!: string;
}