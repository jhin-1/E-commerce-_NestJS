import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../Enums/user.enum.js';

export const roleName = 'Roles';

export const Role = (role: UserRole[]) => {
  return SetMetadata(roleName, role);
};
