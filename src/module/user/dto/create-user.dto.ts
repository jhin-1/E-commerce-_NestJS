import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(6)
  username: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
  @IsString()
  phone: string;
  @IsString()
  gender: 'MALE' | 'FEMALE';
}
