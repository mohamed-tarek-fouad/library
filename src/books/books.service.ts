import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { AddBookDto } from './dtos/addBook.dto';
import { UpdateBookDto } from './dtos/updateBook.dto';
import { SearchBookDto } from './dtos/searchQuery.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async deleteCache(book: any) {
    await this.cacheManager.del('books');
    await this.cacheManager.del(`${book.ISBN}`);
    await this.cacheManager.del(`${book.author}`);
    await this.cacheManager.del(`${book.title}`);
  }
  async checkBookExist(id: string) {
    const checkBookExist = await this.prisma.books.findUnique({
      where: { ISBN: id },
    });

    return checkBookExist;
  }
  async addBook(addBookDto: AddBookDto) {
    const checkBookExist = await this.checkBookExist(addBookDto.ISBN);
    if (checkBookExist) {
      throw new HttpException('book already exist', HttpStatus.BAD_REQUEST);
    }
    const book = await this.prisma.books.create({
      data: addBookDto,
    });
    await this.cacheManager.del('books');
    return { message: 'Added book successfully', book };
  }
  async updateBook(updateBookDto: UpdateBookDto, bookId: string) {
    const checkBookExist = await this.checkBookExist(bookId);
    if (!checkBookExist) {
      throw new HttpException('book does not exist', HttpStatus.BAD_REQUEST);
    }
    const book = await this.prisma.books.update({
      where: { ISBN: bookId },
      data: updateBookDto,
    });
    await this.deleteCache(book);
    return { message: 'updated book successfully', book };
  }
  async deleteBook(bookId: string) {
    const checkBookExist = await this.checkBookExist(bookId);
    if (!checkBookExist) {
      throw new HttpException('book does not exist', HttpStatus.BAD_REQUEST);
    }
    const book = await this.prisma.books.delete({
      where: { ISBN: bookId },
    });
    await this.deleteCache(book);
    return { message: 'book deleted successfully', book };
  }
  async allBooks() {
    const isCached: object = await this.cacheManager.get('books');
    if (isCached) {
      return {
        books: isCached,
        message: 'retrieved all books successfully',
      };
    }
    const books = await this.prisma.books.findMany({});
    if (books.length === 0) {
      throw new HttpException('book does not exist', HttpStatus.BAD_REQUEST);
    }
    await this.cacheManager.set('books', books);
    return { message: 'retrieved all books successfully', books };
  }
  async searchBook(searchQuery: SearchBookDto) {
    if (
      (searchQuery.ISBN && searchQuery.author) ||
      (searchQuery.ISBN && searchQuery.title) ||
      (searchQuery.title && searchQuery.author)
    ) {
      throw new HttpException(
        'only one search parmetar allowed',
        HttpStatus.BAD_REQUEST,
      );
    }
    let isCached = {};
    if (searchQuery.ISBN) {
      isCached = await this.cacheManager.get(`${searchQuery.ISBN}`);
    } else if (searchQuery.author) {
      isCached = await this.cacheManager.get(`${searchQuery.author}`);
    } else {
      isCached = await this.cacheManager.get(`${searchQuery.title}`);
    }
    if (isCached) {
      return {
        books: isCached,
        message: 'fetched all books successfully',
      };
    }
    const books = await this.prisma.books.findMany({
      where: searchQuery,
    });
    if (books.length === 0) {
      throw new HttpException('book does not exist', HttpStatus.BAD_REQUEST);
    }
    if (searchQuery.ISBN) {
      await this.cacheManager.set(`${searchQuery.ISBN}`, books);
    } else if (searchQuery.author) {
      await this.cacheManager.set(`${searchQuery.author}`, books);
    } else {
      await this.cacheManager.set(`${searchQuery.title}`, books);
    }
    return { message: 'retrieved books successfully', books };
  }
}
