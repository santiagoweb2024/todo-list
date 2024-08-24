import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  email!: string;

  @MinLength(6)
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  password!: string;
}
