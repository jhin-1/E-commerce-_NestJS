import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserGender } from '../../../common/Enums/user.enum.js';

@ValidatorConstraint({ name: 'IsMatched', async: false })
export class IsMatched implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    // كاستينج للـ object عشان TypeScript يفهم إن جواه password
    const object = args.object as Record<string, any>;
    return value === object.password;
  }

  defaultMessage(args?: ValidationArguments): string {
    return 'confirm password not match password field py Yosri';
  }
}
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

  @Validate(IsMatched)
  confirmPassword!: string;
}
