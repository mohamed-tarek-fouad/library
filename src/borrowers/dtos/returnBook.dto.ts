import { IsNotEmpty, IsString } from 'class-validator';
export class ReturnBookDto {
  @IsNotEmpty()
  @IsString()
  borrowerId: string;
  @IsString()
  @IsNotEmpty()
  ISBN: string;
}
