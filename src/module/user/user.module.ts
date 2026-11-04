import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { TokenService } from '../../common/services/token/token.service.js';
import { UserModel } from '../../DB/index.js';

@Module({
  imports: [UserModel],
  controllers: [UserController],
  providers: [UserService, TokenService],
})
export class UserModule {}
