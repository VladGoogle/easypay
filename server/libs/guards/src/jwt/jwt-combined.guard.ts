import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CombinedJwtGuard implements CanActivate {
  private accessGuard = new (AuthGuard('jwt-2fa-access'))();
  private adminGuard = new (AuthGuard('jwt-refresh'))();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Try validating with JwtAccessGuard
      const isAccessValid = await this.accessGuard.canActivate(context);
      if (isAccessValid) {
        return true;
      }
    } catch (e) {
      // Ignore and fall back to the next guard
    }

    try {
      // Try validating with JwtAdminAccessGuard
      const isAdminValid = await this.adminGuard.canActivate(context);
      if (isAdminValid) {
        return true;
      }
    } catch (e) {
      // If both fail, return false
    }

    return false;
  }
}
