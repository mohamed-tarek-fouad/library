import { IsNotEmpty, IsString } from 'class-validator';
export class ReportDto {
  @IsNotEmpty()
  @IsString()
  startDate: string;
  @IsString()
  @IsNotEmpty()
  endDate: string;
}
