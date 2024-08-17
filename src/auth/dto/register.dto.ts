import { Transform } from 'class-transformer';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  name!: string;
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
