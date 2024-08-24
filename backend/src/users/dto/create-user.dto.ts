import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
export class CreateUserDto {
  @Transform((params) => params.value.trim())
  @IsString()
  name!: string;
  @IsEmail()
  email!: string;
  @Transform((params) => params.value.trim())
  @IsString()
  password!: string;
}
