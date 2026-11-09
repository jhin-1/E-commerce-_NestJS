import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class ForgetPassWordDtoStpeOne {
    @IsEmail()
    email: string;
}

export class ForgetPassWordDtoStpeTwo {
    @IsString()
    code: string;

    @IsStrongPassword()
    newPassword: string;

}
