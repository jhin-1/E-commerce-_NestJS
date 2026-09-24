import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModel } from '../../DB/index.js';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
