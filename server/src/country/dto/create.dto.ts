import {
    IsNotEmpty,
    IsString,
} from 'class-validator';


export class CreateCountryDTO {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    code!: string;
}
