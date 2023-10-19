import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class UpdateBorrowerDto {
  @MinLength(2)
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(2)
  @IsEmail()
  @IsOptional()
  email: string;
}
