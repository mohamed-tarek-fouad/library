import {
  Controller,
  UseGuards,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  Query,
} from '@nestjs/common';

import { BooksService } from './books.service';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { UpdateBookDto } from './dtos/updateBook.dto';
import { AddBookDto } from './dtos/addBook.dto';
import { SearchBookDto } from './dtos/searchQuery.dto';
@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}
  @UseGuards(JwtAuthGuard)
  @Post('addBook')
  async login(@Body() addBookDto: AddBookDto) {
    return this.bookService.addBook(addBookDto);
  }
  @Patch('updateBook/:bookId')
  @UseGuards(JwtAuthGuard)
  updatebook(
    @Body() updateBookDto: UpdateBookDto,
    @Param('bookId') bookId: string,
  ) {
    return this.bookService.updateBook(updateBookDto, bookId);
  }
  @Delete('deleteBook/:bookId')
  @UseGuards(JwtAuthGuard)
  deletebook(@Param('bookId') bookId: string) {
    return this.bookService.deleteBook(bookId);
  }
  @Get('allBooks')
  @UseGuards(JwtAuthGuard)
  allBooks() {
    return this.bookService.allBooks();
  }
  @Get('searchBook')
  @UseGuards(JwtAuthGuard)
  searchBook(@Query() searshQuery: SearchBookDto) {
    return this.bookService.searchBook(searshQuery);
  }
}
