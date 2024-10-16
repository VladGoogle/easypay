import {Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class JwtAdminResetGuard extends AuthGuard('jwt-admin-reset') {}