import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto.js';
import { User, UserDocument } from '../../DB/index.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto.js';
import { Hashing } from '../../common/utils/security/hash.js';
import { MailService } from '../../common/services/email/email.service.js';

let code: number = Number(Math.random().toFixed(5).split('.')[1]);
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly hash: Hashing,
    private readonly sendEmail: MailService,
  ) {}

  async signup(data: SignupDto): Promise<UserDocument> {
    let emailexsit = await this.UserModel.findOne({ email: data.email });
    if (emailexsit) {
      throw new BadRequestException('This email Existed ');
    }
    data.password = await this.hash.hashtext(data.password);

    let NewUser = await this.UserModel.create(data);
    if (!NewUser) {
      throw new BadRequestException(' Failed to create user ');
    }
    this.sendEmail.sendEmail({
      to: NewUser.email,
      subject: `Welcome to our app ${NewUser.userName}`,
      html: `<h1>Welcome ${NewUser.userName}</h1><p>Thank you for signing up to our social media app <h2>your verification code is ${code}</h2>. We are excited to have you on board!</p>`,
    });
    return NewUser;
  }

  async login(data: LoginDto) {
    return `This action returns all auth`;
  }
}
