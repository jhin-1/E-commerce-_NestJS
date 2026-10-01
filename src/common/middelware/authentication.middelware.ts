import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { TokenService } from "../services/token/token.service.js";
import { JwtPayload } from "jsonwebtoken";


@Injectable()
export class AuthenticationMiddelware implements NestMiddleware {
    constructor(private readonly tokenService: TokenService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const [key, token] = req.headers['authorization']?.split(" ") as string[]
        console.log({ key, token })

        const { decodeData } = await this.tokenService.decodeAccessToken(token) as any
        console.log(decodeData)
        next
    }
}