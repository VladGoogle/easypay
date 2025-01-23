import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CombinedJwtGuard implements CanActivate {
  private accessGuard = new (AuthGuard('jwt-2fa-access'))();
  private adminGuard = new (AuthGuard('jwt-refresh'))();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isAccessValid = await this.accessGuard.canActivate(context);
      if (isAccessValid) {
        return true;
      }
    } catch (e) {}

    try {
      const isAdminValid = await this.adminGuard.canActivate(context);
      if (isAdminValid) {
        return true;
      }
    } catch (e) {}

    return false;
  }
}
