import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from 'nest-keycloak-connect';

export class BaseGuard extends AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      console.log('==============================', request.headers);
      await super.canActivate(context);
      return true;
    } catch (error) {
      Logger.error(error, 'Invalid token');
    }
  }
}
