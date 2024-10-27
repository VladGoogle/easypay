import {User} from "@libs/entities";

export interface TwoFactorTokenPayloadInterface extends Partial<User>{
    isSecondFactorAuthenticated?: boolean
}