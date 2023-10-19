import { Controller, UseGuards, Post, Req, Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { CreateAdminDto } from './dtos/register.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  register(@Body() createUserDto: CreateAdminDto) {
    return this.authService.register(createUserDto);
  }
}
