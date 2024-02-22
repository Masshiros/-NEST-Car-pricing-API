import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.currentUser;
    if (!user) {
      return false;
    }
    return user.admin;
  }
}
