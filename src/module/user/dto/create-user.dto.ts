export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
}
