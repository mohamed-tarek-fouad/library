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
  Res,
} from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { JwtAuthGuard } from 'src/auth/jwtAuthGuard';
import { RegisterBorrowerDto } from './dtos/registerBorrower.dto';
import { UpdateBorrowerDto } from './dtos/updateBorrower.dto';
import { ReturnBookDto } from './dtos/returnBook.dto';
import { CheckoutBookDto } from './dtos/checkoutBook.dto';
import { ReportDto } from './dtos/report.dto';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
@Controller('borrower')
export class BorrowersController {
  constructor(private borrowerService: BorrowersService) {}
  @UseGuards(JwtAuthGuard)
  @Post('registerBorrower')
  async login(@Body() registerBorrowerDto: RegisterBorrowerDto) {
    return this.borrowerService.registerBorrower(registerBorrowerDto);
  }
  @Patch('updateBorrower/:borrowerId')
  @UseGuards(JwtAuthGuard)
  updateBorrower(
    @Body() updateBorrowerDto: UpdateBorrowerDto,
    @Param('borrowerId') borrowerId: string,
  ) {
    return this.borrowerService.updateBorrower(updateBorrowerDto, borrowerId);
  }
  @Delete('deleteBorrower/:borrowerId')
  @UseGuards(JwtAuthGuard)
  deleteBorrower(@Param('borrowerId') borrowerId: string) {
    return this.borrowerService.deleteBorrower(borrowerId);
  }
  @Get('allBorrowers')
  @UseGuards(JwtAuthGuard)
  allBorrowers() {
    return this.borrowerService.allBorrowers();
  }
  @Post('checkoutBook')
  @UseGuards(JwtAuthGuard)
  checkoutBook(@Body() checkoutBookDto: CheckoutBookDto) {
    return this.borrowerService.checkoutBook(checkoutBookDto);
  }
  @Post('returnBook')
  @UseGuards(JwtAuthGuard)
  returnBook(@Body() returnBookDto: ReturnBookDto) {
    return this.borrowerService.returnBook(returnBookDto);
  }
  @Get('booksBorrowerHave/:borrowerId')
  @UseGuards(JwtAuthGuard)
  booksBorrowerHave(@Param('borrowerId') borrowerId: string) {
    return this.borrowerService.booksBorrowerHave(borrowerId);
  }
  @UseGuards(ThrottlerGuard)
  @Get('overDueBooks')
  @UseGuards(JwtAuthGuard)
  overDueBooks() {
    return this.borrowerService.overDueBooks();
  }
  @UseGuards(ThrottlerGuard)
  @Post('exportReport')
  @UseGuards(JwtAuthGuard)
  exportReport(@Body() reportDTo: ReportDto, @Res() res) {
    return this.borrowerService.exportReport(reportDTo, res);
  }
  @Get('allOverDueBorrowsOfTheLastMonth')
  @UseGuards(JwtAuthGuard)
  allOverDueBorrowsOfTheLastMonth() {
    return this.borrowerService.allOverDueBorrowsOfTheLastMonth();
  }
  @Get('allBorrowsOfTheLastMonth')
  @UseGuards(JwtAuthGuard)
  allBorrowsOfTheLastMonth() {
    return this.borrowerService.allBorrowsOfTheLastMonth();
  }
}
