import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
@Module({
  imports: [],
  controllers: [BooksController],
  providers: [BooksService, PrismaService],
})
export class BooksModule {}
