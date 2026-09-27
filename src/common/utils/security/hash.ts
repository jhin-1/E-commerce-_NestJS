import { hash, compare } from 'bcrypt';
import env from '../../../config/env.service.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Hashing {
    constructor(private readonly configService: ConfigService,) { }

    async hashtext(plantext: string): Promise<string> {
        const salt = this.configService.getOrThrow<string>('SALT')
        return await hash(plantext, Number(salt));
    }

    async comparetext(plantext: string, cypherText: string): Promise<boolean> {
        return await compare(plantext, cypherText);
    }
}
