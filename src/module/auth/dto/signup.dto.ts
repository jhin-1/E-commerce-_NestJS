import { IsEmail, IsString } from 'class-validator';
import { UserGender } from '../../../common/Enums/user.enum.js';

export class SignupDto {
  @IsString()
  userName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  gender?: UserGender;

  @IsString()
  phone!: string;

  @IsString()
  password!: string;
}
