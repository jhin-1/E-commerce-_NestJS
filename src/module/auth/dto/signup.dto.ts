import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserGender } from '../../../common/Enums/user.enum.js';

export class SignupDto {

  @IsString()
  @IsNotEmpty()
  userName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsEnum(UserGender, { message: 'Gender must be MALE or FEMALE' })
  gender!: UserGender;

  @IsString()
  password!: string;
}
