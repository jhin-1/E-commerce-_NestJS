import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../services/token/token.service.js';
import type { JwtPayload } from 'jsonwebtoken';
import type { IAuthReq } from '../Interfaces/auth.interface.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../DB/index.js';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req!: IAuthReq;
    let authorzation!: string;

    switch (context.getType()) {
      case 'http':
        req = context.switchToHttp().getRequest();
        authorzation = req.headers['authorization'] as string;

        if (!authorzation) {
          throw new BadRequestException('Token Not Found!');
        }
        break;

      case 'ws':
        req = context.switchToWs().getClient();
        authorzation = req.headers?.['authorization'] as string;
        if (!authorzation) {
          throw new BadRequestException('Token Not Found!');
        }
        break;
    }
    const [flag, token] = authorzation?.split(' ') || [];
    console.log('form guard', { flag, token });
    if (!flag || !token) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    switch (flag) {
      case 'Basic':
        const [userName, password] = Buffer.from(token, 'base64')
          .toString()
          .split(':');
        console.log({ userName, password });
        break;
      default:
        let decodeData = this.tokenService.decodeAccessToken(
          token,
        ) as JwtPayload;

        const userId = decodeData.id || decodeData._id;
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new UnauthorizedException('User not found or no longer exists');
        }

        req.credentials = req.credentials || ({} as any);
        req.credentials.userId = userId;
        req.credentials.decodeData = decodeData;
        req.credentials.user = user;

        break;
    }
    return true;
  }
}
