import { Controller, Post, Body, ValidationPipe, Param } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ForgetPassWordDtoStpeOne, ForgetPassWordDtoStpeTwo } from './dto/forgetpassword.dto.js';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signup(@Body(ValidationPipe) signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @Post('forgetpassword-step-one')
  forgetpasswordstepone(
    @Body(ValidationPipe) ForgetPassWordDtoStpeOne: ForgetPassWordDtoStpeOne,
  ) {
    return this.authService.forgetpasswordStpeOne(ForgetPassWordDtoStpeOne);
  }

  @Post('forgetpassword-step-two/:userId')
  forgetpasswordstepTwo(
    @Param('userId') userId: string,
    @Body(ValidationPipe) ForgetPassWordDtoStpeTwo: ForgetPassWordDtoStpeTwo,
  ) {
    return this.authService.forgetpasswordStpeTwo(ForgetPassWordDtoStpeTwo, userId);
  }
}
