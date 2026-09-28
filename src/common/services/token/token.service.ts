import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../../Enums/user.enum.js';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDocument } from '../../../DB/index.js';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TokenService {
    constructor(private readonly configService: ConfigService) { }
    generateToken(user: Partial<UserDocument>, host: string): { accessToken: string, RefreshToken: string } {
        let Signature = undefined; // genrate secret_key for [admin or user]
        let audience = undefined; // for know if this token for user of admin 
        let RefreshSingature = undefined;

        switch (user.role) {
            case UserRole.ADMIN: // 0 is admin 
                Signature = this.configService.getOrThrow<string>('JWT_ADMIN_SIGNATURE')
                RefreshSingature = this.configService.getOrThrow<string>('JWT_ADMIN_REFRESH_SIGNATURE')
                audience = "Admin"
                break;

            default:
                Signature = this.configService.getOrThrow<string>('JWT_USER_SIGNATURE')
                RefreshSingature = this.configService.getOrThrow<string>('JWT_USER_REFRESH_SIGNATURE')
                audience = "User"
                break;
        }
        let accessToken = jwt.sign({ id: user._id }, Signature, {
            expiresIn: "60m",
            // notBefore:"30s",
            issuer: host,
            audience
        }) // generate token with user id and secret keY

        let RefreshToken = jwt.sign({ id: user._id }, RefreshSingature, {
            expiresIn: "1y",
            issuer: host,
            audience
        })
        return { accessToken, RefreshToken }
    }

    decodeAccessToken(token: string): string | jwt.JwtPayload {
        let decode: string | jwt.JwtPayload | null = jwt.decode(token) as JwtPayload
        let Signature = undefined;
        if (!decode) {
            throw new BadRequestException(" Invlaid Token ")
        }
        switch (decode.aud) {
            case "Admin":
                Signature = this.configService.getOrThrow<string>('JWT_ADMIN_SIGNATURE')
                break;
            default:
                Signature = this.configService.getOrThrow<string>('JWT_USER_SIGNATURE')
                break;
        }
        let decodeData = jwt.verify(token, Signature)
        return decodeData
    }

    decodeRefreshToken(token: string): string | jwt.JwtPayload {
        let decode = jwt.decode(token) as JwtPayload
        let RefreshSingature = undefined;
        if (!decode) {
            throw new BadRequestException(" Invlaid Token ")
        }
        switch (decode.aud) {
            case "Admin":
                RefreshSingature = this.configService.getOrThrow<string>('JWT_ADMIN_REFRESH_SIGNATURE')
                break;
            default:
                RefreshSingature = this.configService.getOrThrow<string>('JWT_USER_REFRESH_SIGNATURE')
                break;
        }
        let decodeData = jwt.verify(token, RefreshSingature)
        return decodeData
    }
}