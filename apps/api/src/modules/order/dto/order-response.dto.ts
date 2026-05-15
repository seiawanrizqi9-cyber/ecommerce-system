import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@app/shared';

class OrderItemResponseDto {
  @ApiProperty({ example: '6821f2d8e9a1b4f3c2a11111' })
  productId: string;

  @ApiProperty({ example: 'Gaming Mouse' })
  productName: string;

  @ApiProperty({ example: 50000 })
  price: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 100000 })
  subtotal: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: '6821f2d8e9a1b4f3c2a99999' })
  _id: string;

  @ApiProperty({ example: '6821f2d8e9a1b4f3c2a00000' })
  user: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: 100000 })
  totalPrice: number;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ example: '2026-05-15T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-05-15T10:00:00.000Z' })
  updatedAt: string;
}
