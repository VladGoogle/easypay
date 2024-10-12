import {UserData} from "@libs/interfaces/user";

export interface Params<T extends UserData = UserData> {
    user: T;
}
