import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserModel } from '../../DB/index.js';
import { Hashing } from '../../common/utils/security/hash.js';
import { MailService } from '../../common/services/email/email.service.js';
import { TokenService } from '../../common/services/token/token.service.js';
import { AuthenticationMiddelware } from '../../common/middelware/authentication.middelware.js';

@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService, Hashing, MailService, TokenService],
})
export class AuthModule {

  configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(AuthenticationMiddelware)
      .forRoutes({
        path: "auth/*", method: RequestMethod.ALL
      })
  }
}
