import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto.js';
import { User, UserDocument } from '../../DB/index.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async signup(data: SignupDto) {
    let NewUser = await this.UserModel.create(data);
    return NewUser;
  }

  async login(data: LoginDto) {
    return `This action returns all auth`;
  }
}
