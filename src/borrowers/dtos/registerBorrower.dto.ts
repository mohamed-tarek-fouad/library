import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class RegisterBorrowerDto {
  @MinLength(2)
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(2)
  @IsEmail()
  email: string;
}
