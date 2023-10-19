import { IsDate, IsNotEmpty, IsString } from 'class-validator';
export class CheckoutBookDto {
  @IsNotEmpty()
  @IsString()
  borrowerId: string;
  @IsString()
  @IsNotEmpty()
  ISBN: string;
  @IsString()
  @IsNotEmpty()
  dueDate: string;
}
