import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
export class ResetPasswordDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  password!: string;
}
