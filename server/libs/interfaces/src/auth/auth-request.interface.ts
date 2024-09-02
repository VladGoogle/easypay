import {UserData} from "../user";

export interface AuthRequest<T extends UserData = UserData> extends Request {
    user: T;
}