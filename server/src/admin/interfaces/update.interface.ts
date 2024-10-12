import {UpdateAdminDTO} from "../dto";
import {UserData} from "@libs/interfaces/user";

export interface AdminUpdateInterface {
    id: string;
    dto: UpdateAdminDTO;
    params: UserData
}