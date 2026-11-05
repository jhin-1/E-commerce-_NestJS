import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from './role.decorator.js';
import { UserRole } from '../Enums/user.enum.js';
import { AuthenticationGuard } from '../guard/authentication.guard.js';
import { AuthorizationGuard } from '../guard/authorzation.guard.js';

export const auth = (roles: UserRole[]) => {
  return applyDecorators(
    Role(roles),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
};
