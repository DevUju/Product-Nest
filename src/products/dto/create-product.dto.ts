import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsUrl,
  IsBoolean,
  IsOptional,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class PropertyDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(50)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsUrl()
  image_url: string;

  @IsBoolean()
  @IsOptional()
  instock?: boolean;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDto)
  @IsOptional()
  properties?: PropertyDto[];
}
