import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
export class AddBookDto {
  @MinLength(2)
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(2)
  author: string;
  @IsString()
  @IsNotEmpty()
  shelfLocation: string;
  @IsString()
  @IsNotEmpty()
  @Length(13)
  ISBN: string;
  @IsInt()
  @IsNotEmpty()
  availableQuantity: number;
}
