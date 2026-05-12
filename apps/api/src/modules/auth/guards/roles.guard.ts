import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { ROLES_KEY } from '../decorators/roles.decorator';

import { Role } from '../enums/role.enum';

import { AuthUser } from '../interfaces/auth-user.interface';

interface RequestWithUser extends Request {
  user: AuthUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    return requiredRoles.includes(user.role);
  }
}
