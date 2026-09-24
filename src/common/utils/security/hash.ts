import { hash, compare } from 'bcrypt';
import env from '../../../config/env.service.js';

export class Hashing {
  constructor() {}

  async hashtext(plantext: string): Promise<string> {
    return await hash(plantext, Number(env.SALT));
  }

  async comparetext(plantext: string, cypherText: string): Promise<boolean> {
    return await compare(plantext, cypherText);
  }
}
