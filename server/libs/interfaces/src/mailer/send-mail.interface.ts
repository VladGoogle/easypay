import {Variable} from "./variable.interface";

export interface SendMail {
    to: string;
    subject: string;
    template: string;
    variables: Variable[]
}