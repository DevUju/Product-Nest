import { IsBoolean, IsString } from 'class-validator';

export class DeleteProductDto {
  @IsString()
  reason: string;

  @IsBoolean()
  confirmDelete: boolean;
}
