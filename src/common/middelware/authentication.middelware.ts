import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { TokenService } from '../services/token/token.service.js';

@Injectable()
export class AuthenticationMiddelware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      throw new BadRequestException('Authorization token is required');
    }

    const [key, token] = authorization.split(' ');
    if (!key || !token) {
      throw new BadRequestException('Invalid authorization format');
    }

    const decodeData = await this.tokenService.decodeAccessToken(token);
    console.log({ key, token, decodeData });

    next();
  }
}
