import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: '6821f2d8e9a1b4f3c2a11111',
  })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
