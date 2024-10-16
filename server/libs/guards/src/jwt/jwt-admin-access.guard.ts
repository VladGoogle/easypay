import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAdminAccessGuard extends AuthGuard('jwt-admin') {}
