import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
export class SearchBookDto {
  @MinLength(2)
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title: string;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(2)
  author: string;
  @IsString()
  @IsNotEmpty()
  @Length(13)
  @IsOptional()
  ISBN: string;
}
