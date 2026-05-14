import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Gaming Mouse RGB',
    description: 'Nama produk',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Mouse gaming dengan RGB dan sensor 12000 DPI',
    description: 'Deskripsi produk',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 250000,
    description: 'Harga produk',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 15,
    description: 'Jumlah stok produk',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    example: 'Gaming',
    description: 'Kategori produk',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'List gambar produk',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Status aktif produk',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
