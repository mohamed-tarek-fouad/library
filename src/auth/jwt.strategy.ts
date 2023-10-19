import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_SECRET,
      sessionStorage: false,
    });
  }
  async validate(payload: any) {
    const checkUserExist = await this.prisma.admins.findUnique({
      where: { id: payload.user.userId },
    });
    if (!checkUserExist) {
      throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
    }
    return {
      userId: payload.user.userId,
    };
  }
}
