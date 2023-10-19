import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';
import { CreateAdminDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
@Injectable()
export class AuthService {
  constructor(
    private jwtServise: JwtService,
    private prisma: PrismaService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.prisma.admins.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }
  async login(user: any): Promise<any> {
    delete user.password;
    return {
      message: 'loged in successfully',
      ...user,
      access_token: this.jwtServise.sign({
        user: { userId: user.id, role: user.role },
      }),
    };
  }
  async register(userDto: CreateAdminDto) {
    const userExist = await this.prisma.admins.findUnique({
      where: {
        email: userDto.email,
      },
    });
    if (userExist) {
      throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    }
    const saltOrRounds = 10;
    userDto.password = await bcrypt.hash(userDto.password, saltOrRounds);
    const user = await this.prisma.admins.create({
      data: userDto,
    });
    delete user.password;
    return {
      ...user,
      access_token: this.jwtServise.sign({
        user: { userId: user.id },
      }),
      message: 'user has been created successfully',
    };
  }
}
