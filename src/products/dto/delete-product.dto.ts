import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class DeleteProductDto {
  @IsString()
  reason: string;

  @IsBoolean()
  confirmDelete: boolean;
}
