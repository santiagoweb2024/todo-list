import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }

  @Get('verify/:token')
  async verifyAccount(@Param('token') token: string) {
    return this.authService.verifyAccount(token);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.login(user);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  logout() {
    return 'Logout';
  }
}
