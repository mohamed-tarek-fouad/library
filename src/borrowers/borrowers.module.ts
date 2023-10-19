import { BorrowersService } from './borrowers.service';
import { BorrowersController } from './borrowers.controller';

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { BooksService } from 'src/books/books.service';

@Module({
  imports: [],
  controllers: [BorrowersController],
  providers: [BorrowersService, PrismaService, BooksService],
})
export class BorrowersModule {}
