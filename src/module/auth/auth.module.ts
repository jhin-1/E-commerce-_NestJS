import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModel } from '../../DB/index.js';
import { Hashing } from '../../common/utils/security/hash.js';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService, Hashing],
})
export class AuthModule { }
//Hashing