import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserDocument } from '../../DB/index.js';
import { Types } from 'mongoose';

export interface IAuthReq extends Request {
  credentials: {
    decodeData: JwtPayload;
    userId: string | Types.ObjectId;
    user: UserDocument;
  };
  user: UserDocument;
}
