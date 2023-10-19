import { BorrowersModule } from './borrowers/borrowers.module';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtAuthGuard } from './auth/jwtAuthGuard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as CacheStore from 'cache-manager-ioredis';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    BorrowersModule,
    BooksModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: CacheStore,
      host: 'redis',
      port: process.env.REDIS,
      ttl: 60 * 60 * 6,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    // }),
  ],
  controllers: [AppController],

  providers: [JwtAuthGuard, AppService],
})
export class AppModule {}
