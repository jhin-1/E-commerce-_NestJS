import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { roleName } from '../Decorator/role.decorator.js';
import { UserRole } from '../Enums/user.enum.js';
import { IAuthReq } from '../Interfaces/auth.interface.js';
import { User, UserDocument } from '../../DB/index.js';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(roleName, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    let user!: UserDocument | undefined;

    switch (context.getType()) {
      case 'http':
        user = (context.switchToHttp().getRequest() as IAuthReq).credentials
          ?.user;
        break;

      default:
        break;
    }

    if (!user) {
      throw new ForbiddenException(
        'Access denied: {User} credentials not found',
      );
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(' cannot access this! ');
    }
    return true;
  }
}
