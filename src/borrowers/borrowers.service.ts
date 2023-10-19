import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { RegisterBorrowerDto } from './dtos/registerBorrower.dto';
import { UpdateBorrowerDto } from './dtos/updateBorrower.dto';
import { ReturnBookDto } from './dtos/returnBook.dto';
import { BooksService } from 'src/books/books.service';
import { CheckoutBookDto } from './dtos/checkoutBook.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ReportDto } from './dtos/report.dto';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import { writeFile, utils } from 'xlsx';
@Injectable()
export class BorrowersService {
  constructor(
    private prisma: PrismaService,
    private bookService: BooksService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async checkBorrowerExist(id: string) {
    const borrower = await this.prisma.borrowers.findUnique({ where: { id } });
    return borrower;
  }
  async registerBorrower(registerBorrowerDto: RegisterBorrowerDto) {
    const borrower = await this.prisma.borrowers.create({
      data: registerBorrowerDto,
    });
    await this.cacheManager.del('borrowers');
    return { message: 'Borrower registered successfully', borrower };
  }
  async updateBorrower(
    updateBorrowerDto: UpdateBorrowerDto,
    borrowerId: string,
  ) {
    const checkBorrowerExist = await this.checkBorrowerExist(borrowerId);
    if (!checkBorrowerExist) {
      throw new HttpException(
        'borrower does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const borrower = await this.prisma.borrowers.update({
      where: { id: borrowerId },
      data: updateBorrowerDto,
    });
    await this.cacheManager.del('borrowers');
    return { message: 'updated borrwers data successfully', borrower };
  }
  async deleteBorrower(borrowerId: string) {
    const checkBorrowerExist = this.checkBorrowerExist(borrowerId);
    if (!checkBorrowerExist) {
      throw new HttpException(
        'borrower does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const borrower = await this.prisma.borrowers.delete({
      where: { id: borrowerId },
    });
    await this.cacheManager.del('borrowers');
    return { message: 'borrower deleted successfully', borrower };
  }
  async allBorrowers() {
    const isCached: object = await this.cacheManager.get('books');
    if (isCached) {
      return {
        borrowers: isCached,
        message: 'fetched all borrowers successfully',
      };
    }
    const borrowers = await this.prisma.borrowers.findMany({});
    if (borrowers.length === 0) {
      throw new HttpException(
        'borrower does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.cacheManager.set('borrowers', borrowers);
    return { message: 'retrieved all borrowers successfully', borrowers };
  }
  async checkoutBook(checkoutBookDto: CheckoutBookDto) {
    const checkBorrowerExist = await this.checkBorrowerExist(
      checkoutBookDto.borrowerId,
    );
    const checkBookExist = await this.bookService.checkBookExist(
      checkoutBookDto.ISBN,
    );
    if (!checkBookExist || !checkBorrowerExist) {
      throw new HttpException(
        'borrower or book does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (checkBookExist.availableQuantity === 0) {
      throw new HttpException('book does not exist', HttpStatus.BAD_REQUEST);
    }
    const dueDate = new Date(checkoutBookDto.dueDate).toISOString();
    const borrowBook = await this.prisma.booksBorrowed.create({
      data: {
        bookId: checkoutBookDto.ISBN,
        borrowerId: checkoutBookDto.borrowerId,
        dueDate,
      },
    });
    await this.prisma.books.update({
      where: { ISBN: checkoutBookDto.ISBN },
      data: { availableQuantity: { decrement: 1 } },
    });
    await this.bookService.deleteCache(checkBookExist);
    return { message: 'book borrowed successfully', borrowBook };
  }
  async returnBook(returnBookDto: ReturnBookDto) {
    const checkBorrowerExist = await this.checkBorrowerExist(
      returnBookDto.borrowerId,
    );
    const checkBookExist = await this.bookService.checkBookExist(
      returnBookDto.ISBN,
    );
    if (!checkBookExist || !checkBorrowerExist) {
      throw new HttpException(
        'borrower or book does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const borrowedBook = await this.prisma.booksBorrowed.findMany({
      where: {
        bookId: returnBookDto.ISBN,
        borrowerId: returnBookDto.borrowerId,
        returned: false,
      },
    });
    if (borrowedBook.length === 0) {
      throw new HttpException(
        'borrower did not borrow this book',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.booksBorrowed.updateMany({
      where: {
        bookId: returnBookDto.ISBN,
        borrowerId: returnBookDto.borrowerId,
      },
      data: {
        returned: true,
        returnedDate: new Date(),
        returnedLate: borrowedBook[0].dueDate > new Date() ? false : true,
      },
    });
    await this.prisma.books.update({
      where: { ISBN: returnBookDto.ISBN },
      data: { availableQuantity: { increment: 1 } },
    });
    await this.bookService.deleteCache(checkBookExist);
    return { message: 'book returned successfully' };
  }
  async booksBorrowerHave(borrowerId: string) {
    const books = await this.prisma.booksBorrowed.findMany({
      where: { borrowerId, returned: false },
      include: { book: true, borrwer: true },
    });
    return { message: 'retrieved books borrower have', books };
  }
  async overDueBooks() {
    const books = await this.prisma.booksBorrowed.findMany({
      include: { book: true, borrwer: true },
    });
    const overDue = books.map((book) => {
      if (book.borrowDate > book.dueDate) return book;
    });
    return { message: 'retrieved all over due books', overDue };
  }
  mostCommonBorrower(borrowing) {
    const map = {};
    for (let i = 0; i < borrowing.length; i++) {
      if (map[borrowing[i].borrwer.id]) {
        map[borrowing[i].borrwer.id] += 1;
      } else {
        map[borrowing[i].borrwer.id] = 1;
      }
    }
    let highestValue = '';
    try {
      highestValue = Object.keys(map)?.reduce((a, b) =>
        map[a] > map[b] ? a : b,
      );
    } catch (err) {}
    return highestValue;
  }
  mostBorrowedBookISBN(borrowing) {
    const map = {};
    for (let i = 0; i < borrowing.length; i++) {
      if (map[borrowing[i].book.ISBN]) {
        map[borrowing[i].book.ISBN] += 1;
      } else {
        map[borrowing[i].book.ISBN] = 1;
      }
    }
    let highestValue = '';
    try {
      highestValue = Object.keys(map)?.reduce((a, b) =>
        map[a] > map[b] ? a : b,
      );
    } catch (err) {}
    return highestValue;
  }
  numberOfBooksReturnedLate(borrowing) {
    let books = 0;
    for (let i = 0; i < borrowing.length; i++) {
      if (borrowing[i].returnedLate === true) books += 1;
    }
    return books;
  }
  async exportReport(reportDTo: ReportDto, res) {
    const endDate = new Date(reportDTo.endDate).toISOString();
    const startDate = new Date(reportDTo.startDate).toISOString();
    const borrowingData = await this.prisma.booksBorrowed.findMany({
      where: {
        borrowDate: { gte: startDate, lte: endDate },
      },
      include: { borrwer: true, book: true },
    });
    const numberOfBooksBorrowed = borrowingData.length;
    const mostBorrowedBookISBN = this.mostBorrowedBookISBN(borrowingData);
    const mostCommonBorrower = this.mostCommonBorrower(borrowingData);
    const numberOfBooksReturnedLate =
      this.numberOfBooksReturnedLate(borrowingData);
    try {
      const data = [
        [
          'numberOfBooksBorrowed',
          'mostBorrowedBookISBN',
          'mostCommonBorrower',
          'numberOfBooksReturnedLate',
        ],
        [
          numberOfBooksBorrowed,
          mostBorrowedBookISBN,
          mostCommonBorrower,
          numberOfBooksReturnedLate,
        ],
      ];
      const workbook = utils.book_new();
      const worksheet = utils.aoa_to_sheet(data);
      utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
      await writeFile(workbook, './uploads/Report.xlsx');
      const filePath = './uploads/Report.xlsx';
      const fileExists = fs.existsSync(filePath);

      if (fileExists) {
        const fileContent = fs.readFileSync(filePath);
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=Report.xlsx',
        );
        res.send(fileContent);
      } else {
        console.log('File creation failed:', filePath);
        res.status(500).send('Failed to export file');
      }
    } catch (error) {
      console.error('Error while exporting to Excel:', error);
      res.status(500).send('Failed to export file');
    }
  }
  catch(error) {
    return error;
  }
  async allOverDueBorrowsOfTheLastMonth() {
    const now = new Date();
    const monthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    const borrows = await this.prisma.booksBorrowed.findMany({
      where: { dueDate: { gte: monthAgo }, returned: false },
    });
    return { message: 'all Over Due Borrows Of The Last Month', borrows };
  }
  async allBorrowsOfTheLastMonth() {
    const now = new Date();
    const monthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    const borrows = await this.prisma.booksBorrowed.findMany({
      where: { dueDate: { gte: monthAgo } },
    });
    return { message: 'all Borrows Of The Last Month', borrows };
  }
}
