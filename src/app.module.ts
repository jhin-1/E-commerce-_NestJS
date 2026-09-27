import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './module/user/user.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './module/auth/auth.module.js';
import { TransformInterceptor } from './common/Interceptors/transform.interceptor.js';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.pro'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('DB connected'));
          connection.on('open', () => console.log('open'));
          connection.on('disconnected', () => console.log('disconnected'));
          connection.on('reconnected', () => console.log('reconnected'));
          connection.on('disconnecting', () => console.log('disconnecting'));

          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    //----------- Modules ----------------
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor, // 👈 تشغيل الـ Interceptor عالمياً
    },
  ],
  exports: [],
})
export class AppModule { }
