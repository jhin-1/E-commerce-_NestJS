import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../../DB/index.js';
import { IAuthReq } from '../Interfaces/auth.interface.js';

export const User = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    let user!: UserDocument;
    switch (context.getType()) {
      case 'http':
        user = (context.switchToHttp().getRequest() as IAuthReq).credentials
          .user;
        break;

      default:
        break;
    }
    return user;
  },
);
