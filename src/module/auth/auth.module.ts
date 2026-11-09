import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModel } from '../../DB/index.js';
import { Hashing } from '../../common/utils/security/hash.js';
import { MailService } from '../../common/services/email/email.service.js';
import { TokenService } from '../../common/services/token/token.service.js';
import { AuthenticationMiddelware } from '../../common/middelware/authentication.middelware.js';

@Module({
  imports: [UserModel], // انا متحاج خدمات منmodule تاني 
  controllers: [AuthController],
  providers: [AuthService, Hashing, MailService, TokenService], // انا بقدم خدمات 
  exports: [] // انا بسمح لغيري باستخدام خدماتي 
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddelware).forRoutes({
      path: 'auth/*',
      method: RequestMethod.ALL,
    });
  }
}
